<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->with('children')
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(fn ($c) => $this->transform($c));

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    public function show($slug)
    {
        $category = Category::active()
            ->with('children')
            ->withCount('products')
            ->where('slug', $slug)
            ->firstOrFail();

        $products = Product::active()
            ->with(['category:id,name,slug,icon', 'brand:id,name', 'mainImage'])
            ->where('category_id', $category->id)
            ->orderBy('created_at', 'desc')
            ->take(40)
            ->get()
            ->map(function ($p) {
                return [
                    'id'               => $p->id,
                    'name'             => $p->name,
                    'slug'             => $p->slug,
                    'price'            => (float) $p->price,
                    'effective_price'  => (float) $p->effective_price,
                    'discount_percentage' => $p->discount_percentage,
                    'stock'            => (int) $p->stock,
                    'in_stock'         => $p->is_in_stock,
                    'rating'           => (float) $p->avg_rating,
                    'review_count'     => (int) $p->review_count,
                    'sales_count'      => (int) $p->sales_count,
                    'is_new'           => (bool) $p->is_new_arrival,
                    'brand'            => $p->brand ? $p->brand->name : null,
                    'image'            => optional($p->mainImage)->url ?? '',
                    'thumbnail'        => optional($p->mainImage)->thumbnail_url ?? '',
                ];
            });

        return response()->json([
            'success'    => true,
            'data'       => $this->transform($category),
            'products'   => $products,
        ]);
    }

    private function transform(Category $category): array
    {
        return [
            'id'          => $category->id,
            'name'        => $category->name,
            'slug'        => $category->slug,
            'description' => $category->description,
            'image'       => $category->image,
            'icon'        => $category->icon,
            'products_count' => (int) $category->products_count,
            'children'    => $category->children
                ->map(fn ($child) => [
                    'id'          => $child->id,
                    'name'        => $child->name,
                    'slug'        => $child->slug,
                    'image'       => $child->image,
                    'icon'        => $child->icon,
                    'products_count' => (int) $child->products_count,
                ])
                ->values(),
        ];
    }
}