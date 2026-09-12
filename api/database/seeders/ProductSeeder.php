<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $warehouse = Warehouse::firstOrCreate(
            ['name' => 'Main Warehouse'],
            ['name' => 'Main Warehouse', 'code' => 'WH-MAIN', 'city' => 'Dhaka', 'is_active' => true]
        );

        $categories = [
            ['Electronics', 'electronics', 'Smartphone'],
            ['Fashion',       'fashion',       'Shirt'],
            ['Home & Living', 'home-living',   'Home'],
            ['Health',        'health',        'HeartPulse'],
            ['Kids',          'kids',          'Baby'],
            ['Sports',        'sports',        'Dumbbell'],
            ['Books',         'books',         'BookOpen'],
            ['Jewelry',       'jewelry',       'Gem'],
        ];

        $categoryModels = [];
        foreach ($categories as [$name, $slug, $icon]) {
            $categoryModels[$slug] = Category::firstOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'slug' => $slug, 'icon' => $icon, 'is_active' => true, 'sort_order' => count($categoryModels)]
            );
        }

        $brands = [
            'SoundElite', 'TechNova', 'ComfortWear', 'HomeCraft', 'GadgetPro',
            'PureLife', 'KidsJoy', 'SportZone', 'PageTurner', 'Glow&Co',
        ];

        $brandModels = [];
        foreach ($brands as $i => $name) {
            $brandModels[$name] = Brand::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'slug' => Str::slug($name), 'is_active' => true, 'sort_order' => $i]
            );
        }

        $attributes = [
            'color' => ProductAttribute::firstOrCreate(['slug' => 'color'], ['name' => 'Color', 'slug' => 'color']),
            'size'  => ProductAttribute::firstOrCreate(['slug' => 'size'],  ['name' => 'Size',  'slug' => 'size']),
            'storage' => ProductAttribute::firstOrCreate(['slug' => 'storage'], ['name' => 'Storage', 'slug' => 'storage']),
        ];

        $products = [
            [
                'name' => 'Premium Wireless Noise-Cancelling Headphones Pro Max',
                'category' => 'electronics', 'brand' => 'SoundElite',
                'price' => 7999, 'sale_price' => 4599, 'stock' => 23,
                'rating' => 4.8, 'sold' => 5600, 'views' => 12400,
                'featured' => true, 'trending' => true, 'best_seller' => true, 'new' => false,
                'variants' => [
                    ['name' => 'Midnight Black', 'color' => '#1a1a2e', 'price' => null, 'stock' => 8],
                    ['name' => 'Arctic White',   'color' => '#f0f0f0', 'price' => null, 'stock' => 6],
                    ['name' => 'Navy Blue',      'color' => '#1e3a5f', 'price' => null, 'stock' => 9],
                ],
            ],
            [
                'name' => 'Smartphone Galaxy X 128GB',
                'category' => 'electronics', 'brand' => 'TechNova',
                'price' => 32999, 'sale_price' => 28999, 'stock' => 15,
                'rating' => 4.6, 'sold' => 3200, 'views' => 9800,
                'featured' => true, 'trending' => true, 'best_seller' => true, 'new' => true,
                'variants' => [
                    ['name' => '128GB', 'storage' => '128GB', 'price' => null, 'stock' => 10],
                    ['name' => '256GB', 'storage' => '256GB', 'price' => 30999, 'stock' => 5],
                ],
            ],
            [
                'name' => 'Ultra Slim Laptop 14"',
                'category' => 'electronics', 'brand' => 'TechNova',
                'price' => 64999, 'sale_price' => 54999, 'stock' => 8,
                'rating' => 4.7, 'sold' => 1200, 'views' => 6700,
                'featured' => true, 'trending' => true, 'best_seller' => false, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Smart Watch Series 5',
                'category' => 'electronics', 'brand' => 'GadgetPro',
                'price' => 9999, 'sale_price' => 7899, 'stock' => 40,
                'rating' => 4.5, 'sold' => 2400, 'views' => 5400,
                'featured' => false, 'trending' => true, 'best_seller' => false, 'new' => false,
                'variants' => [
                    ['name' => 'Black', 'color' => '#1a1a2e', 'price' => null, 'stock' => 20],
                    ['name' => 'Silver', 'color' => '#c0c0c0', 'price' => null, 'stock' => 20],
                ],
            ],
            [
                'name' => 'Portable Power Bank 20000mAh',
                'category' => 'electronics', 'brand' => 'GadgetPro',
                'price' => 1599, 'flash_price' => 1299, 'flash_start' => now()->subDay(), 'flash_end' => now()->addDays(2),
                'stock' => 120, 'rating' => 4.6, 'sold' => 4200, 'views' => 3200,
                'featured' => false, 'trending' => false, 'best_seller' => true, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Mechanical Keyboard RGB',
                'category' => 'electronics', 'brand' => 'TechNova',
                'price' => 4499, 'sale_price' => 3299, 'stock' => 35,
                'rating' => 4.7, 'sold' => 1800, 'views' => 4100,
                'featured' => false, 'trending' => true, 'best_seller' => false, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Cotton Casual T-Shirt',
                'category' => 'fashion', 'brand' => 'ComfortWear',
                'price' => 999, 'sale_price' => 599, 'stock' => 200,
                'rating' => 4.3, 'sold' => 8200, 'views' => 5100,
                'featured' => true, 'trending' => false, 'best_seller' => true, 'new' => false,
                'variants' => [
                    ['name' => 'S', 'size' => 'S', 'price' => null, 'stock' => 50],
                    ['name' => 'M', 'size' => 'M', 'price' => null, 'stock' => 60],
                    ['name' => 'L', 'size' => 'L', 'price' => null, 'stock' => 50],
                    ['name' => 'XL', 'size' => 'XL', 'price' => null, 'stock' => 40],
                ],
            ],
            [
                'name' => 'Denim Jacket Classic',
                'category' => 'fashion', 'brand' => 'ComfortWear',
                'price' => 2199, 'stock' => 45,
                'rating' => 4.2, 'sold' => 950, 'views' => 2100,
                'featured' => false, 'trending' => true, 'best_seller' => false, 'new' => true,
                'variants' => [
                    ['name' => 'S', 'size' => 'S', 'price' => 2199, 'stock' => 10],
                    ['name' => 'M', 'size' => 'M', 'price' => 2199, 'stock' => 12],
                    ['name' => 'L', 'size' => 'L', 'price' => 2199, 'stock' => 13],
                    ['name' => 'XL', 'size' => 'XL', 'price' => 2299, 'stock' => 10],
                ],
            ],
            [
                'name' => 'Running Sneakers Lightweight',
                'category' => 'fashion', 'brand' => 'SportZone',
                'price' => 2599, 'sale_price' => 1899, 'stock' => 60,
                'rating' => 4.4, 'sold' => 1300, 'views' => 2800,
                'featured' => false, 'trending' => false, 'best_seller' => true, 'new' => true,
                'variants' => [
                    ['name' => '40', 'size' => '40', 'price' => null, 'stock' => 15],
                    ['name' => '41', 'size' => '41', 'price' => null, 'stock' => 15],
                    ['name' => '42', 'size' => '42', 'price' => null, 'stock' => 15],
                    ['name' => '43', 'size' => '43', 'price' => null, 'stock' => 15],
                ],
            ],
            [
                'name' => 'LED Desk Lamp Smart',
                'category' => 'home-living', 'brand' => 'HomeCraft',
                'price' => 1299, 'stock' => 80,
                'rating' => 4.6, 'sold' => 2100, 'views' => 3600,
                'featured' => true, 'trending' => false, 'best_seller' => false, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Ceramic Tea Cup Set (6 pcs)',
                'category' => 'home-living', 'brand' => 'HomeCraft',
                'price' => 899, 'flash_price' => 749, 'flash_start' => now()->subHour(), 'flash_end' => now()->addDays(3),
                'stock' => 150, 'rating' => 4.5, 'sold' => 3300, 'views' => 4100,
                'featured' => false, 'trending' => false, 'best_seller' => true, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Organic Face Serum 30ml',
                'category' => 'health', 'brand' => 'PureLife',
                'price' => 1299, 'sale_price' => 899, 'stock' => 90,
                'rating' => 4.5, 'sold' => 2600, 'views' => 3900,
                'featured' => true, 'trending' => true, 'best_seller' => false, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Essential Oil Diffuser 500ml',
                'category' => 'health', 'brand' => 'PureLife',
                'price' => 1499, 'stock' => 55,
                'rating' => 4.4, 'sold' => 1100, 'views' => 1900,
                'featured' => false, 'trending' => false, 'best_seller' => false, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Kids Wooden Building Blocks',
                'category' => 'kids', 'brand' => 'KidsJoy',
                'price' => 1599, 'sale_price' => 1099, 'stock' => 70,
                'rating' => 4.8, 'sold' => 1900, 'views' => 2200,
                'featured' => true, 'trending' => false, 'best_seller' => true, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Stuffed Teddy Bear 50cm',
                'category' => 'kids', 'brand' => 'KidsJoy',
                'price' => 799, 'stock' => 100,
                'rating' => 4.7, 'sold' => 1400, 'views' => 1600,
                'featured' => false, 'trending' => true, 'best_seller' => false, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Yoga Mat Premium 6mm',
                'category' => 'sports', 'brand' => 'SportZone',
                'price' => 1199, 'sale_price' => 799, 'stock' => 85,
                'rating' => 4.4, 'sold' => 1500, 'views' => 2100,
                'featured' => true, 'trending' => false, 'best_seller' => false, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Adjustable Dumbbell Set 20kg',
                'category' => 'sports', 'brand' => 'SportZone',
                'price' => 8999, 'stock' => 12,
                'rating' => 4.6, 'sold' => 400, 'views' => 900,
                'featured' => false, 'trending' => true, 'best_seller' => false, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'The Art of Product Design (Hardcover)',
                'category' => 'books', 'brand' => 'PageTurner',
                'price' => 649, 'stock' => 60,
                'rating' => 4.9, 'sold' => 2200, 'views' => 3100,
                'featured' => true, 'trending' => true, 'best_seller' => true, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => 'Bangla Novel Collection Box Set',
                'category' => 'books', 'brand' => 'PageTurner',
                'price' => 1299, 'flash_price' => 999, 'flash_start' => now()->subDays(1), 'flash_end' => now()->addDays(1),
                'stock' => 40, 'rating' => 4.7, 'sold' => 800, 'views' => 1400,
                'featured' => false, 'trending' => false, 'best_seller' => true, 'new' => false,
                'variants' => [],
            ],
            [
                'name' => '18K Gold Plated Necklace',
                'category' => 'jewelry', 'brand' => 'Glow&Co',
                'price' => 2999, 'stock' => 25,
                'rating' => 4.5, 'sold' => 700, 'views' => 1200,
                'featured' => true, 'trending' => true, 'best_seller' => false, 'new' => true,
                'variants' => [],
            ],
            [
                'name' => 'Pearl Stud Earrings',
                'category' => 'jewelry', 'brand' => 'Glow&Co',
                'price' => 1499, 'stock' => 50,
                'rating' => 4.6, 'sold' => 900, 'views' => 1500,
                'featured' => false, 'trending' => false, 'best_seller' => false, 'new' => false,
                'variants' => [],
            ],
        ];

        foreach ($products as $i => $data) {
            $category = $categoryModels[$data['category']];
            $brand = $brandModels[$data['brand']];

            $slug = Str::slug($data['name']);
            $suffix = 1;
            while (Product::withTrashed()->where('slug', $slug)->exists()) {
                $slug = Str::slug($data['name']) . '-' . $suffix++;
            }

            $product = Product::create([
                'category_id'        => $category->id,
                'brand_id'           => $brand->id,
                'warehouse_id'       => $warehouse->id,
                'name'               => $data['name'],
                'slug'               => $slug,
                'sku'                => 'HKS-' . Str::upper(Str::random(6)) . '-' . ($i + 1),
                'short_description'  => 'High quality ' . strtolower($data['name']) . ' from ' . $brand->name . '.',
                'description'        => '<h2>' . $data['name'] . '</h2><p>Premium quality, great value. This product is sourced from trusted suppliers and backed by HikmahShop quality guarantee within Bangladesh.</p><h3>Features</h3><ul><li>Premium build quality</li><li>Fast nationwide delivery</li><li>Easy 7-day returns</li><li>100% authentic &amp; original</li></ul>',
                'price'              => $data['price'],
                'cost_price'         => round($data['price'] * 0.65, 2),
                'sale_price'         => $data['sale_price'] ?? null,
                'flash_price'        => $data['flash_price'] ?? null,
                'flash_start'        => $data['flash_start'] ?? null,
                'flash_end'          => $data['flash_end'] ?? null,
                'stock'              => $data['stock'],
                'low_stock_threshold'=> 10,
                'avg_rating'         => $data['rating'],
                'review_count'       => (int) round($data['sold'] * 0.04),
                'sales_count'        => $data['sold'],
                'views_count'        => $data['views'],
                'is_active'          => true,
                'is_featured'        => $data['featured'],
                'is_trending'        => $data['trending'],
                'is_best_seller'     => $data['best_seller'],
                'is_new_arrival'     => $data['new'],
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'url'        => '',
                'thumbnail_url' => '',
                'alt_text'   => $data['name'],
                'is_main'    => true,
                'sort_order' => 0,
            ]);

            foreach ($data['variants'] as $v) {
                $variant = ProductVariant::create([
                    'product_id' => $product->id,
                    'name'       => $v['name'],
                    'sku'        => $product->sku . '-' . Str::upper(Str::random(4)),
                    'price'      => $v['price'],
                    'stock'      => $v['stock'],
                    'is_active'  => true,
                    'sort_order' => array_search($v, $data['variants']),
                ]);

                if (isset($v['color'])) {
                    $variant->attributeValues()->create([
                        'attribute_id' => $attributes['color']->id,
                        'value'        => $v['name'],
                        'color_code'   => $v['color'],
                    ]);
                }
                if (isset($v['size'])) {
                    $variant->attributeValues()->create([
                        'attribute_id' => $attributes['size']->id,
                        'value'        => $v['size'],
                    ]);
                }
                if (isset($v['storage'])) {
                    $variant->attributeValues()->create([
                        'attribute_id' => $attributes['storage']->id,
                        'value'        => $v['storage'],
                    ]);
                }
            }
        }
    }
}