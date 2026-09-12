<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Campaign;

class MobileApiController extends Controller
{
    public function home()
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'banners' => Campaign::active()
                    ->where('is_featured', true)
                    ->select('id', 'name', 'slug', 'banner_image', 'theme_color', 'ends_at')
                    ->get(),

                'categories' => Category::active()
                    ->root()
                    ->withCount('products')
                    ->select('id', 'name', 'slug', 'icon', 'image')
                    ->orderBy('sort_order')
                    ->limit(8)
                    ->get(),

                'flash_sale' => [
                    'products' => Product::active()
                        ->onFlashSale()
                        ->with('mainImage')
                        ->select('id', 'name', 'slug', 'price', 'flash_price', 'flash_end', 'stock')
                        ->limit(10)
                        ->get()
                        ->map(fn ($p) => $p->append(['effective_price', 'discount_percentage'])),
                    'ends_at' => Product::active()->onFlashSale()->min('flash_end'),
                ],

                'trending' => Product::active()
                    ->trending()
                    ->with('mainImage')
                    ->select('id', 'name', 'slug', 'price', 'sale_price', 'avg_rating', 'sales_count')
                    ->limit(8)
                    ->get()
                    ->map(fn ($p) => $p->append(['effective_price'])),

                'new_arrivals' => Product::active()
                    ->newArrivals()
                    ->with('mainImage')
                    ->select('id', 'name', 'slug', 'price', 'sale_price')
                    ->latest()
                    ->limit(8)
                    ->get()
                    ->map(fn ($p) => $p->append(['effective_price'])),
            ],
        ]);
    }

    public function config()
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'app_version'             => '1.0.0',
                'min_version'             => '1.0.0',
                'force_update'            => false,
                'maintenance'             => false,
                'currency'                => 'BDT',
                'currency_symbol'         => '৳',
                'free_shipping_threshold' => 999,
                'payment_methods'         => ['cod', 'bkash', 'nagad', 'rocket', 'sslcommerz'],
                'social_login'            => ['google', 'facebook'],
                'support_phone'           => '+880 1XXX-XXXXXX',
                'support_email'           => 'support@hikmahshop.com',
            ],
        ]);
    }
}
