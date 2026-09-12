<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()
            ->with([
                'category:id,name,slug,icon',
                'brand:id,name',
                'mainImage:id,product_id,url,thumbnail_url,alt_text,is_main,sort_order',
            ]);

        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($brandSlugs = $request->input('brands')) {
            $slugs = array_filter(explode(',', $brandSlugs));
            $query->whereHas('brand', function ($q) use ($slugs) {
                $q->whereIn('slug', $slugs);
            });
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        if ($request->boolean('in_stock')) {
            $query->where('stock', '>', 0);
        }
        if ($request->boolean('on_sale')) {
            $query->where(function ($q) {
                $q->whereNotNull('sale_price')->whereColumn('sale_price', '<', 'price')
                  ->orWhere(function ($q2) {
                      $q2->whereNotNull('flash_price')
                         ->whereNotNull('flash_start')
                         ->whereNotNull('flash_end')
                         ->where('flash_start', '<=', now())
                         ->where('flash_end', '>=', now());
                  });
            });
        }
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }
        if ($request->boolean('trending')) {
            $query->where('is_trending', true);
        }
        if ($request->boolean('new_arrival')) {
            $query->where('is_new_arrival', true);
        }
        if ($request->boolean('best_seller')) {
            $query->where('is_best_seller', true);
        }
        if ($request->boolean('flash_sale')) {
            $query->onFlashSale();
        }

        $sort = $request->input('sort', 'latest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('sales_count', 'desc');
                break;
            case 'rating':
                $query->orderBy('avg_rating', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate((int) $request->input('per_page', 12));

        $products->getCollection()->transform(function ($product) {
            $hits = $this->transformProduct($product);
            return $hits;
        });

        return response()->json([
            'success' => true,
            'data'    => $products->items(),
            'meta'    => [
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
                'per_page'     => $products->perPage(),
                'total'        => $products->total(),
            ],
        ]);
    }

    public function show(Request $request, $id)
    {
        $product = Product::active()
            ->with([
                'category:id,name,slug,icon',
                'brand:id,name,logo',
                'images',
                'variants' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order'),
                'variants.attributeValues.attribute',
            ])
            ->findOrFail($id);

        $product->increment('views_count');

        return response()->json([
            'success' => true,
            'data'    => $this->transformProduct($product, true),
        ]);
    }

    public function related($id)
    {
        $product = Product::active()->findOrFail($id);

        $related = Product::active()
            ->with(['category:id,name,slug,icon', 'brand:id,name', 'mainImage'])
            ->where('id', '!=', $product->id)
            ->where(function ($q) use ($product) {
                $q->where('category_id', $product->category_id);
                if ($product->brand_id) {
                    $q->orWhere('brand_id', $product->brand_id);
                }
            })
            ->take(8)
            ->get()
            ->map(fn ($p) => $this->transformProduct($p));

        return response()->json([
            'success' => true,
            'data'    => $related,
        ]);
    }

    private function transformProduct(Product $product, bool $full = false): array
    {
        $onSale = $product->is_on_flash_sale
            || ($product->sale_price && $product->sale_price < $product->price);

        $data = [
            'id'                => $product->id,
            'name'              => $product->name,
            'slug'              => $product->slug,
            'sku'               => $product->sku,
            'short_description' => $product->short_description,
            'price'             => (float) $product->effective_price,
            'original_price'    => $onSale ? (float) $product->price : null,
            'price_after_sale'  => (float) $product->effective_price,
            'effective_price'   => (float) $product->effective_price,
            'discount_percentage' => $product->discount_percentage,
            'stock'             => (int) $product->stock,
            'in_stock'          => $product->is_in_stock,
            'rating'            => (float) $product->avg_rating,
            'review_count'      => (int) $product->review_count,
            'sales_count'       => (int) $product->sales_count,
            'views_count'       => (int) $product->views_count,
            'is_new'            => (bool) $product->is_new_arrival,
            'is_featured'       => (bool) $product->is_featured,
            'is_best_seller'    => (bool) $product->is_best_seller,
            'is_flash_sale'     => (bool) $product->is_on_flash_sale,
            'flash_end'         => $product->flash_end?->toISOString(),
            'category'          => $product->category
                ? ['id' => $product->category->id, 'name' => $product->category->name, 'slug' => $product->category->slug, 'icon' => $product->category->icon]
                : null,
            'brand'             => $product->brand ? $product->brand->only(['id', 'name']) : null,
            'image'             => optional($product->mainImage)->url ?? '',
            'thumbnail'         => optional($product->mainImage)->thumbnail_url ?? '',
        ];

        if ($full) {
            $data['description']   = $product->description;
            $data['flash_price']   = $product->flash_price ? (float) $product->flash_price : null;
            $data['images']        = $product->images->map(fn ($img) => [
                'id'        => $img->id,
                'url'       => $img->url,
                'thumbnail' => $img->thumbnail_url,
                'alt'       => $img->alt_text,
                'color'     => $img->color_code,
                'is_main'   => (bool) $img->is_main,
            ])->values();

            $data['variants'] = $product->variants->map(fn ($v) => [
                'id'           => $v->id,
                'name'         => $v->name,
                'sku'          => $v->sku,
                'price'        => $v->price !== null ? (float) $v->price : (float) $product->effective_price,
                'stock'        => (int) $v->stock,
                'attributes'   => $v->attributeValues->map(fn ($av) => [
                    'attribute' => $av->attribute->name ?? null,
                    'value'     => $av->value,
                    'color'     => $av->color_code,
                ])->values(),
            ])->values();

            $data['attributes'] = $product->variants
                ->flatMap(fn ($v) => $v->attributeValues)
                ->map(fn ($av) => [
                    'name'  => $av->attribute->name ?? null,
                    'value' => $av->value,
                ])
                ->unique(fn ($a) => ($a['name'] ?? '') . ':' . $a['value'])
                ->values();
        }

        return $data;
    }
}