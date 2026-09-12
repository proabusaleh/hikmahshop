<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\DeliveryZone;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Services\SSLCOMMERZService;
use App\Services\MFSPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function summary(Request $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->with(['items.product.mainImage', 'items.variant'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cart is empty',
            ], 422);
        }

        $subtotal = $cart->subtotal;
        $zones    = DeliveryZone::where('is_active', true)->orderBy('sort_order')->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'items'          => $cart->items,
                'subtotal'       => $subtotal,
                'total_items'    => $cart->total_items,
                'delivery_zones' => $zones->map(fn($z) => [
                    'id'              => $z->id,
                    'name'            => $z->name,
                    'shipping_charge' => $z->isFreeShipping($subtotal) ? 0 : (float) $z->shipping_charge,
                    'free_shipping'   => $z->isFreeShipping($subtotal),
                    'estimated'       => $z->estimated_delivery,
                ]),
                'payment_methods' => [
                    ['id' => 'cod',        'label' => 'Cash on Delivery',   'icon' => 'Banknote'],
                    ['id' => 'bkash',      'label' => 'bKash',              'icon' => 'Smartphone'],
                    ['id' => 'nagad',      'label' => 'Nagad',              'icon' => 'Smartphone'],
                    ['id' => 'rocket',     'label' => 'Rocket',             'icon' => 'Smartphone'],
                    ['id' => 'sslcommerz', 'label' => 'Card / Internet Banking (SSLCOMMERZ)', 'icon' => 'CreditCard'],
                ],
            ],
        ]);
    }

    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'address.name'           => 'required|string|max:255',
            'address.phone'          => 'required|string|max:20',
            'address.email'          => 'nullable|email',
            'address.address_line_1' => 'required|string',
            'address.address_line_2' => 'nullable|string',
            'address.city'           => 'required|string',
            'address.district'       => 'required|string',
            'address.division'       => 'required|string',
            'address.zip_code'       => 'nullable|string',
            'delivery_zone_id'       => 'required|exists:delivery_zones,id',
            'payment_method'         => 'required|in:cod,bkash,nagad,rocket,sslcommerz',
            'coupon_code'            => 'nullable|string',
            'customer_note'          => 'nullable|string|max:500',
        ]);

        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 422);
        }

        return DB::transaction(function () use ($validated, $user, $cart) {
            $zone     = DeliveryZone::findOrFail($validated['delivery_zone_id']);
            $subtotal = $cart->subtotal;

            $shippingCharge = $zone->isFreeShipping($subtotal) ? 0 : (float) $zone->shipping_charge;

            $couponDiscount = 0;
            $couponId       = null;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', strtoupper($validated['coupon_code']))->first();
                if ($coupon) {
                    $validation = $coupon->isValid($user, $subtotal);
                    if ($validation['valid']) {
                        $couponDiscount = $coupon->calculateDiscount($subtotal);
                        $couponId       = $coupon->id;
                        $coupon->increment('usage_count');
                        $coupon->users()->syncWithoutDetaching([
                            $user->id => ['usage_count' => DB::raw('usage_count + 1')],
                        ]);
                    }
                }
            }

            $total = $subtotal + $shippingCharge - $couponDiscount;

            $order = Order::create([
                'user_id'         => $user->id,
                'status'          => 'pending',
                'subtotal'        => $subtotal,
                'shipping_charge' => $shippingCharge,
                'coupon_discount' => $couponDiscount,
                'total'           => $total,
                'paid_amount'     => 0,
                'due_amount'      => $total,
                'payment_method'  => $validated['payment_method'],
                'payment_status'  => 'pending',
                'coupon_code'     => $validated['coupon_code'] ?? null,
                'coupon_id'       => $couponId,
                'delivery_zone'   => $zone->name,
                'estimated_delivery' => now()->addDays($zone->estimated_days_max),
                'customer_note'   => $validated['customer_note'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id'   => $item->product_id,
                    'variant_id'   => $item->variant_id,
                    'product_name' => $item->product->name,
                    'product_sku'  => $item->product->sku,
                    'variant_name' => $item->variant?->name,
                    'quantity'     => $item->quantity,
                    'unit_price'   => $item->current_price,
                    'total'        => $item->current_price * $item->quantity,
                ]);

                if ($item->variant) {
                    $item->variant->decrement('stock', $item->quantity);
                } else {
                    $item->product->decrement('stock', $item->quantity);
                }

                $item->product->increment('sales_count', $item->quantity);
            }

            $order->shippingAddress()->create(
                array_merge($validated['address'], ['type' => 'shipping'])
            );

            $order->statusHistory()->create([
                'to_status' => 'pending',
                'note'      => 'Order placed by customer',
            ]);

            $cart->items()->delete();

            $paymentData = $this->initiatePayment($order, $validated['payment_method'], $validated['address']);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data'    => [
                    'order'       => $order->load('items', 'shippingAddress'),
                    'payment'     => $paymentData,
                    'next_action' => $paymentData['action'] ?? 'none',
                ],
            ], 201);
        });
    }

    private function initiatePayment(Order $order, string $method, array $address): array
    {
        return match ($method) {
            'cod' => [
                'action'  => 'none',
                'message' => 'Pay cash on delivery',
            ],

            'sslcommerz' => tap(
                app(SSLCOMMERZService::class)->createSession($order, [
                    'name'    => $address['name'],
                    'email'   => $address['email'] ?? $order->user->email,
                    'phone'   => $address['phone'],
                    'address' => $address['address_line_1'],
                    'city'    => $address['city'],
                    'zip'     => $address['zip_code'] ?? '1200',
                ]),
                fn($result) => $result['action'] = $result['success'] ? 'redirect' : 'error'
            ),

            'bkash' => tap(
                app(MFSPaymentService::class)->initiateBkash($order),
                fn($result) => $result['action'] = $result['success'] ? 'redirect' : 'error'
            ),

            'nagad' => tap(
                app(MFSPaymentService::class)->initiateNagad($order),
                fn($result) => $result['action'] = $result['success'] ? 'redirect' : 'error'
            ),

            'rocket' => [
                'action'  => 'redirect',
                'message' => 'Rocket integration coming soon',
            ],

            default => ['action' => 'none'],
        };
    }
}
