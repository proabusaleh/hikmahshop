<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->with(['product.mainImage', 'product.category', 'product.brand'])
            ->latest()
            ->get()
            ->map(fn($item) => [
                'id'                   => $item->id,
                'product'              => $item->product,
                'price_when_added'     => (float) $item->price_when_added,
                'current_price'        => $item->current_price,
                'has_price_dropped'    => $item->has_price_dropped,
                'price_drop_percentage' => $item->price_drop_percentage,
                'is_back_in_stock'     => $item->is_back_in_stock,
                'price_drop_alert'     => $item->price_drop_alert,
                'stock_alert'          => $item->stock_alert,
                'added_at'             => $item->created_at,
            ]);

        return response()->json(['success' => true, 'data' => $wishlist]);
    }

    public function toggle(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'success' => true,
                'message' => 'Removed from wishlist',
                'data'    => ['in_wishlist' => false],
            ]);
        }

        Wishlist::create([
            'user_id'          => $request->user()->id,
            'product_id'       => $product->id,
            'price_when_added' => $product->effective_price,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Added to wishlist',
            'data'    => ['in_wishlist' => true],
        ], 201);
    }

    public function updateAlerts(Request $request, Wishlist $wishlist)
    {
        $this->authorize('update', $wishlist);

        $validated = $request->validate([
            'price_drop_alert' => 'boolean',
            'stock_alert'      => 'boolean',
        ]);

        $wishlist->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Alerts updated',
        ]);
    }

    public function moveToCart(Request $request, Wishlist $wishlist)
    {
        $this->authorize('update', $wishlist);

        app(CartController::class)->add(new Request([
            'product_id' => $wishlist->product_id,
            'quantity'   => 1,
        ]));

        $wishlist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Moved to cart',
        ]);
    }
}
