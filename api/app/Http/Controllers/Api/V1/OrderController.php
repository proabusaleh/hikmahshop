<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Courier;
use App\Models\DeliveryTracking;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::forUser($request->user()->id)
            ->with(['items.product.mainImage', 'shippingAddress', 'tracking'])
            ->when($request->input('status'), fn($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(10);

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function show(Request $request, string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        if (!$request->user()->hasRole(['super_admin', 'admin', 'manager']) &&
            $order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load([
            'items.product.mainImage',
            'items.variant.attributeValues.attribute',
            'shippingAddress',
            'billingAddress',
            'statusHistory.changedByUser',
            'tracking.courier',
        ]);

        return response()->json(['success' => true, 'data' => $order]);
    }

    public function cancel(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) abort(403);

        if (!$order->canTransitionTo('cancelled')) {
            return response()->json([
                'success' => false,
                'message' => "Cannot cancel order in '{$order->status}' status",
            ], 422);
        }

        $order->transitionTo('cancelled', $request->user()->id, 'Cancelled by customer');

        foreach ($order->items as $item) {
            if ($item->variant) {
                $item->variant->increment('stock', $item->quantity);
            } else {
                $item->product->increment('stock', $item->quantity);
            }
        }

        return response()->json(['success' => true, 'message' => 'Order cancelled']);
    }

    public function adminIndex(Request $request)
    {
        $query = Order::with(['user:id,name,email', 'items', 'shippingAddress', 'tracking']);

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }
        if ($payment = $request->input('payment_status')) {
            $query->where('payment_status', $payment);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'LIKE', "%{$search}%"))
                  ->orWhereHas('shippingAddress', fn($aq) => $aq->where('phone', 'LIKE', "%{$search}%"));
            });
        }
        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $orders = $query->latest()->paginate($request->input('per_page', 20));

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'note'   => 'nullable|string|max:500',
        ]);

        if (!$order->canTransitionTo($validated['status'])) {
            return response()->json([
                'success' => false,
                'message' => "Cannot transition from '{$order->status}' to '{$validated['status']}'",
                'allowed' => Order::STATUS_FLOW[$order->status] ?? [],
            ], 422);
        }

        $order->transitionTo(
            $validated['status'],
            $request->user()->id,
            $validated['note']
        );

        return response()->json([
            'success' => true,
            'message' => "Order status updated to '{$validated['status']}'",
            'data'    => $order->fresh(),
        ]);
    }

    public function assignCourier(Request $request, Order $order)
    {
        $validated = $request->validate([
            'courier_id'      => 'required|exists:couriers,id',
            'tracking_number' => 'required|string|max:100',
            'consignment_id'  => 'nullable|string',
        ]);

        $courier = Courier::findOrFail($validated['courier_id']);

        $tracking = DeliveryTracking::updateOrCreate(
            ['order_id' => $order->id],
            [
                'courier_id'      => $courier->id,
                'tracking_number' => $validated['tracking_number'],
                'consignment_id'  => $validated['consignment_id'] ?? null,
                'status'          => 'pending',
                'tracking_history' => [[
                    'status'   => 'assigned',
                    'location' => 'Warehouse',
                    'note'     => "Assigned to {$courier->name}",
                    'time'     => now()->toDateTimeString(),
                ]],
            ]
        );

        $order->update([
            'courier_name'    => $courier->name,
            'tracking_number' => $validated['tracking_number'],
        ]);

        return response()->json([
            'success' => true,
            'message' => "Courier {$courier->name} assigned",
            'data'    => $tracking,
        ]);
    }

    public function updateTracking(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'   => 'required|in:picked_up,in_transit,out_for_delivery,delivered,failed,returned_to_sender',
            'location' => 'required|string|max:255',
            'note'     => 'nullable|string',
        ]);

        $tracking = $order->tracking;
        if (!$tracking) {
            return response()->json(['success' => false, 'message' => 'No tracking found'], 404);
        }

        $tracking->addTrackingEvent(
            $validated['status'],
            $validated['location'],
            $validated['note'] ?? null
        );

        $statusMap = [
            'picked_up'        => 'shipped',
            'in_transit'       => 'shipped',
            'out_for_delivery' => 'out_for_delivery',
            'delivered'        => 'delivered',
        ];

        if (isset($statusMap[$validated['status']]) && $order->canTransitionTo($statusMap[$validated['status']])) {
            $order->transitionTo($statusMap[$validated['status']], $request->user()->id);
        }

        return response()->json([
            'success' => true,
            'data'    => $tracking->fresh(),
        ]);
    }

    public function addNote(Request $request, Order $order)
    {
        $validated = $request->validate(['note' => 'required|string|max:1000']);
        $order->update(['admin_note' => $validated['note']]);
        return response()->json(['success' => true, 'message' => 'Note added']);
    }

    public function adminPayments(Request $request)
    {
        $query = Order::query()
            ->select([
                'id', 'order_number', 'user_id', 'payment_method', 'payment_status',
                'transaction_id', 'paid_amount', 'due_amount', 'total', 'status', 'created_at',
            ])
            ->with(['user:id,name,email']);

        if ($payment = $request->input('payment_status')) {
            $query->where('payment_status', $payment);
        }
        if ($method = $request->input('payment_method')) {
            $query->where('payment_method', $method);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                  ->orWhere('transaction_id', 'LIKE', "%{$search}%");
            });
        }
        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $payments = $query->latest()->paginate($request->input('per_page', 20));

        return response()->json(['success' => true, 'data' => $payments]);
    }
}
