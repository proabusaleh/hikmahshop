<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getCart(Request $request): Cart
    {
        return Cart::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['session_id' => $request->session()->getId()]
        );
    }

    public function index(Request $request)
    {
        $cart = $this->getCart($request);
        $cart->load(['items.product.mainImage', 'items.variant.attributeValues.attribute']);

        return response()->json([
            'success' => true,
            'data'    => [
                'items'       => $cart->items->map(fn($item) => [
                    'id'               => $item->id,
                    'product'          => $item->product,
                    'variant'          => $item->variant,
                    'quantity'         => $item->quantity,
                    'unit_price'       => (float) $item->unit_price,
                    'current_price'    => $item->current_price,
                    'has_price_changed'=> $item->has_price_changed,
                    'subtotal'         => $item->subtotal,
                ]),
                'subtotal'    => $cart->subtotal,
                'total_items' => $cart->total_items,
            ],
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity'   => 'integer|min:1|max:99',
        ]);

        $cart     = $this->getCart($request);
        $product  = Product::findOrFail($validated['product_id']);
        $variant  = isset($validated['variant_id'])
            ? ProductVariant::findOrFail($validated['variant_id'])
            : null;
        $quantity = $validated['quantity'] ?? 1;

        $availableStock = $variant ? $variant->stock : $product->stock;
        if ($quantity > $availableStock) {
            return response()->json([
                'success' => false,
                'message' => "Only {$availableStock} items available",
            ], 422);
        }

        $unitPrice = $variant ? $variant->effective_price : $product->effective_price;

        $existingItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('variant_id', $variant?->id)
            ->first();

        if ($existingItem) {
            $newQty = $existingItem->quantity + $quantity;
            if ($newQty > $availableStock) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot add more. Only {$availableStock} in stock.",
                ], 422);
            }
            $existingItem->update([
                'quantity'   => $newQty,
                'unit_price' => $unitPrice,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'variant_id' => $variant?->id,
                'quantity'   => $quantity,
                'unit_price' => $unitPrice,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Added to cart',
            'data'    => [
                'total_items' => $cart->fresh()->total_items,
            ],
        ]);
    }

    public function updateQuantity(Request $request, CartItem $item)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:99',
        ]);

        $availableStock = $item->variant ? $item->variant->stock : $item->product->stock;
        if ($validated['quantity'] > $availableStock) {
            return response()->json([
                'success' => false,
                'message' => "Only {$availableStock} items available",
            ], 422);
        }

        $item->update([
            'quantity'   => $validated['quantity'],
            'unit_price' => $item->current_price,
        ]);

        return response()->json(['success' => true, 'message' => 'Quantity updated']);
    }

    public function remove(CartItem $item)
    {
        $item->delete();
        return response()->json(['success' => true, 'message' => 'Item removed']);
    }

    public function clear(Request $request)
    {
        $this->getCart($request)->items()->delete();
        return response()->json(['success' => true, 'message' => 'Cart cleared']);
    }
}
