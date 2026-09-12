<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category:id,name', 'brand:id,name', 'warehouse:id,name'])
            ->select('id', 'sku', 'name', 'stock', 'low_stock_threshold', 'price', 'cost_price', 'is_active', 'warehouse_id', 'category_id', 'brand_id');

        if ($request->input('low_stock')) {
            $query->whereColumn('stock', '<=', 'low_stock_threshold')->where('stock', '>', 0);
        }
        if ($request->input('out_of_stock')) {
            $query->where('stock', 0);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('sku', 'LIKE', "%{$search}%");
            });
        }
        if ($warehouse = $request->input('warehouse')) {
            $query->where('warehouse_id', $warehouse);
        }

        $products = $query->orderBy('stock', 'asc')->paginate(20);

        $products->getCollection()->transform(function ($p) {
            $p->stock_status = $p->stock === 0
                ? 'out_of_stock'
                : ($p->stock <= $p->low_stock_threshold ? 'low_stock' : 'in_stock');
            return $p;
        });

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function lowStock()
    {
        $products = Product::active()
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->with('category:id,name')
            ->select('id', 'sku', 'name', 'stock', 'low_stock_threshold', 'price')
            ->orderBy('stock')
            ->get()
            ->map(fn ($p) => [
                ...$p->toArray(),
                'stock_status' => $p->stock === 0 ? 'out_of_stock' : 'low_stock',
                'deficit'      => max(0, $p->low_stock_threshold - $p->stock),
            ]);

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function history(Request $request)
    {
        $query = InventoryTransaction::with([
            'product:id,name,sku',
            'variant:id,name,sku',
            'warehouse:id,name',
            'createdBy:id,name',
        ]);

        if ($productId = $request->input('product_id')) {
            $query->where('product_id', $productId);
        }
        if ($type = $request->input('type')) {
            $query->where('type', $type);
        }
        if ($from = $request->input('from')) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to = $request->input('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $history = $query->latest()->paginate(20);

        return response()->json(['success' => true, 'data' => $history]);
    }

    public function stockIn(Request $request)
    {
        $validated = $request->validate([
            'product_id'   => 'required|exists:products,id',
            'variant_id'   => 'nullable|exists:product_variants,id',
            'warehouse_id' => 'nullable|exists:warehouses,id',
            'supplier_id'  => 'nullable|exists:suppliers,id',
            'quantity'     => 'required|integer|min:1',
            'unit_cost'    => 'nullable|numeric|min:0',
            'reason'       => 'nullable|string|max:500',
            'notes'        => 'nullable|string|max:1000',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::findOrFail($validated['product_id']);
            $previousStock = $product->stock;
            $newStock = $previousStock + $validated['quantity'];

            if ($validated['variant_id'] ?? null) {
                $variant = ProductVariant::findOrFail($validated['variant_id']);
                $variant->increment('stock', $validated['quantity']);
            }
            $product->update(['stock' => $newStock]);

            $txn = InventoryTransaction::create([
                'type'           => 'stock_in',
                'product_id'     => $product->id,
                'variant_id'     => $validated['variant_id'] ?? null,
                'warehouse_id'   => $validated['warehouse_id'] ?? null,
                'supplier_id'    => $validated['supplier_id'] ?? null,
                'quantity'       => $validated['quantity'],
                'previous_stock' => $previousStock,
                'new_stock'      => $newStock,
                'unit_cost'      => $validated['unit_cost'] ?? null,
                'total_cost'     => ($validated['unit_cost'] ?? 0) * $validated['quantity'],
                'reason'         => $validated['reason'] ?? 'Stock replenishment',
                'created_by'     => $request->user()->id,
                'notes'          => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Added {$validated['quantity']} units. New stock: {$newStock}",
                'data'    => $txn->load('product:id,name,sku'),
            ], 201);
        });
    }

    public function stockOut(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity'   => 'required|integer|min:1',
            'reason'     => 'required|string|max:500',
            'notes'      => 'nullable|string|max:1000',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::findOrFail($validated['product_id']);

            if ($product->stock < $validated['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock. Available: {$product->stock}",
                ], 422);
            }

            $previousStock = $product->stock;
            $newStock = $previousStock - $validated['quantity'];

            if ($validated['variant_id'] ?? null) {
                $variant = ProductVariant::findOrFail($validated['variant_id']);
                $variant->decrement('stock', $validated['quantity']);
            }
            $product->update(['stock' => $newStock]);

            $txn = InventoryTransaction::create([
                'type'           => 'stock_out',
                'product_id'     => $product->id,
                'variant_id'     => $validated['variant_id'] ?? null,
                'quantity'       => -$validated['quantity'],
                'previous_stock' => $previousStock,
                'new_stock'      => $newStock,
                'reason'         => $validated['reason'],
                'created_by'     => $request->user()->id,
                'notes'          => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Removed {$validated['quantity']} units. New stock: {$newStock}",
                'data'    => $txn,
            ]);
        });
    }

    public function adjust(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'new_stock'  => 'required|integer|min:0',
            'reason'     => 'required|string|max:500',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $product = Product::findOrFail($validated['product_id']);
            $previousStock = $product->stock;
            $diff = $validated['new_stock'] - $previousStock;

            $product->update(['stock' => $validated['new_stock']]);

            if ($validated['variant_id'] ?? null) {
                $variant = ProductVariant::findOrFail($validated['variant_id']);
                $variant->update(['stock' => $validated['new_stock']]);
            }

            $txn = InventoryTransaction::create([
                'type'           => 'adjustment',
                'product_id'     => $product->id,
                'variant_id'     => $validated['variant_id'] ?? null,
                'quantity'       => $diff,
                'previous_stock' => $previousStock,
                'new_stock'      => $validated['new_stock'],
                'reason'         => $validated['reason'],
                'created_by'     => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Stock adjusted: {$previousStock} → {$validated['new_stock']}",
                'data'    => $txn,
            ]);
        });
    }
}