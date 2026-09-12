<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

class SearchService
{
    public function search(array $params): array
    {
        $query = Product::active()->with([
            'mainImage',
            'category:id,name,slug',
            'brand:id,name,slug',
            'variants.attributeValues.attribute',
        ]);

        if (!empty($params['q'])) {
            $keyword = trim($params['q']);
            $this->recordSearchTerm($keyword);

            $query->where(function ($q) use ($keyword) {
                $q->whereFullText(['name', 'short_description', 'description'], $keyword)
                  ->orWhere('name', 'LIKE', "%{$keyword}%")
                  ->orWhere('sku', 'LIKE', "%{$keyword}%")
                  ->orWhereHas('brand', function ($bq) use ($keyword) {
                      $bq->where('name', 'LIKE', "%{$keyword}%");
                  })
                  ->orWhereHas('category', function ($cq) use ($keyword) {
                      $cq->where('name', 'LIKE', "%{$keyword}%");
                  });
            });
        }

        if (!empty($params['category'])) {
            if (is_numeric($params['category'])) {
                $query->where('category_id', $params['category']);
            } else {
                $query->whereHas('category', fn($q) => $q->where('slug', $params['category']));
            }
        }

        if (!empty($params['brands'])) {
            $brands = is_array($params['brands']) ? $params['brands'] : explode(',', $params['brands']);
            $query->whereHas('brand', fn($q) => $q->whereIn('slug', $brands));
        }

        if (isset($params['min_price'])) {
            $query->where('price', '>=', (float) $params['min_price']);
        }
        if (isset($params['max_price'])) {
            $query->where('price', '<=', (float) $params['max_price']);
        }

        if (!empty($params['min_rating'])) {
            $query->where('avg_rating', '>=', (float) $params['min_rating']);
        }

        if (!empty($params['in_stock'])) {
            $query->where('stock', '>', 0);
        }

        if (!empty($params['on_sale'])) {
            $query->whereNotNull('sale_price')
                  ->whereColumn('sale_price', '<', 'price');
        }

        if (!empty($params['color'])) {
            $colors = is_array($params['color']) ? $params['color'] : explode(',', $params['color']);
            $query->whereHas('variants.attributeValues', function ($q) use ($colors) {
                $q->whereHas('attribute', fn($aq) => $aq->where('slug', 'color'))
                  ->whereIn('value', $colors);
            });
        }

        if (!empty($params['size'])) {
            $sizes = is_array($params['size']) ? $params['size'] : explode(',', $params['size']);
            $query->whereHas('variants.attributeValues', function ($q) use ($sizes) {
                $q->whereHas('attribute', fn($aq) => $aq->where('slug', 'size'))
                  ->whereIn('value', $sizes);
            });
        }

        if (!empty($params['featured']))    $query->where('is_featured', true);
        if (!empty($params['trending']))    $query->where('is_trending', true);
        if (!empty($params['new_arrival'])) $query->where('is_new_arrival', true);
        if (!empty($params['best_seller'])) $query->where('is_best_seller', true);
        if (!empty($params['flash_sale'])) {
            $query->whereNotNull('flash_price')
                  ->where('flash_start', '<=', now())
                  ->where('flash_end', '>=', now());
        }

        $sort = $params['sort'] ?? 'relevance';
        $query = $this->applySorting($query, $sort, !empty($params['q']));

        $perPage = min((int) ($params['per_page'] ?? 12), 48);
        $page    = max((int) ($params['page'] ?? 1), 1);

        $results = $query->paginate($perPage, ['*'], 'page', $page);

        $results->getCollection()->transform(function ($product) {
            return $product->append([
                'effective_price',
                'discount_percentage',
                'is_on_flash_sale',
                'is_in_stock',
            ]);
        });

        return [
            'results'         => $results,
            'total'           => $results->total(),
            'filters_applied' => $this->getAppliedFilters($params),
            'available_filters' => $this->getAvailableFilters($params),
        ];
    }

    public function suggestions(string $query, int $limit = 8): array
    {
        if (strlen(trim($query)) < 2) return [];

        $cacheKey = 'search_suggestions:' . md5($query);

        return Cache::remember($cacheKey, 300, function () use ($query, $limit) {
            $products = Product::active()
                ->where(function ($q) use ($query) {
                    $q->where('name', 'LIKE', "%{$query}%")
                      ->orWhere('sku', 'LIKE', "%{$query}%");
                })
                ->select('id', 'name', 'slug', 'price', 'sale_price')
                ->with('mainImage')
                ->orderBy('sales_count', 'desc')
                ->limit($limit)
                ->get()
                ->map(fn($p) => [
                    'id'    => $p->id,
                    'name'  => $this->highlightMatch($p->name, $query),
                    'slug'  => $p->slug,
                    'price' => $p->effective_price,
                    'original_price' => $p->sale_price ? (float) $p->price : null,
                    'image' => $p->mainImage?->thumbnail_url,
                ]);

            $categories = \App\Models\Category::active()
                ->where('name', 'LIKE', "%{$query}%")
                ->select('id', 'name', 'slug')
                ->limit(3)
                ->get()
                ->map(fn($c) => [
                    'type' => 'category',
                    'name' => $this->highlightMatch($c->name, $query),
                    'slug' => $c->slug,
                ]);

            $brands = \App\Models\Brand::active()
                ->where('name', 'LIKE', "%{$query}%")
                ->select('id', 'name', 'slug')
                ->limit(3)
                ->get()
                ->map(fn($b) => [
                    'type' => 'brand',
                    'name' => $this->highlightMatch($b->name, $query),
                    'slug' => $b->slug,
                ]);

            return [
                'products'   => $products,
                'categories' => $categories,
                'brands'     => $brands,
            ];
        });
    }

    public function popularSearches(int $limit = 10): array
    {
        try {
            $terms = Redis::zrevrange('search:popular', 0, $limit - 1, ['WITHSCORES']);
            $result = [];
            for ($i = 0; $i < count($terms); $i += 2) {
                $result[] = [
                    'term'  => $terms[$i],
                    'count' => (int) $terms[$i + 1],
                ];
            }
            return $result;
        } catch (\Exception $e) {
            return Cache::get('search:popular_fallback', []);
        }
    }

    public function recentSearches(?int $userId, int $limit = 5): array
    {
        if (!$userId) return [];

        $key = "search:recent:user:{$userId}";
        try {
            return Redis::lrange($key, 0, $limit - 1);
        } catch (\Exception $e) {
            return [];
        }
    }

    public function clearRecentSearches(?int $userId): void
    {
        if (!$userId) return;
        try {
            Redis::del("search:recent:user:{$userId}");
        } catch (\Exception $e) {
            // Silently fail
        }
    }

    private function recordSearchTerm(string $term): void
    {
        $term = strtolower(trim($term));
        if (strlen($term) < 2) return;

        try {
            Redis::zincrby('search:popular', 1, $term);
            $count = Redis::zcard('search:popular');
            if ($count > 500) {
                Redis::zremrangebyrank('search:popular', 0, $count - 501);
            }
        } catch (\Exception $e) {
            $popular = Cache::get('search:popular_fallback', []);
            $popular[$term] = ($popular[$term] ?? 0) + 1;
            arsort($popular);
            Cache::put('search:popular_fallback', array_slice($popular, 0, 100, true), 86400);
        }
    }

    private function applySorting($query, string $sort, bool $hasKeyword)
    {
        return match ($sort) {
            'price-asc'  => $query->orderBy('price', 'asc'),
            'price-desc' => $query->orderBy('price', 'desc'),
            'newest'     => $query->orderBy('created_at', 'desc'),
            'rating'     => $query->orderBy('avg_rating', 'desc'),
            'bestseller' => $query->orderBy('sales_count', 'desc'),
            'discount'   => $query->orderByRaw('(price - COALESCE(sale_price, price)) / price DESC'),
            'relevance'  => $hasKeyword
                ? $query->orderBy('sales_count', 'desc')->orderBy('avg_rating', 'desc')
                : $query->orderBy('sales_count', 'desc')->orderBy('created_at', 'desc'),
            default      => $query->orderBy('sales_count', 'desc'),
        };
    }

    private function highlightMatch(string $text, string $query): string
    {
        $pattern = '/' . preg_quote($query, '/') . '/i';
        return preg_replace($pattern, '<mark>$0</mark>', $text);
    }

    private function getAppliedFilters(array $params): array
    {
        $applied = [];
        foreach (['category', 'brands', 'min_price', 'max_price', 'min_rating', 'color', 'size'] as $key) {
            if (!empty($params[$key])) {
                $applied[$key] = $params[$key];
            }
        }
        return $applied;
    }

    private function getAvailableFilters(array $params): array
    {
        return [
            'categories' => \App\Models\Category::active()->root()->withCount('products')->get(),
            'brands'     => \App\Models\Brand::active()->withCount('products')->get(),
            'price_range' => [
                'min' => (float) Product::active()->min('price'),
                'max' => (float) Product::active()->max('price'),
            ],
            'colors' => \App\Models\ProductAttributeValue::whereHas('attribute', fn($q) => $q->where('slug', 'color'))->get(),
            'sizes'  => \App\Models\ProductAttributeValue::whereHas('attribute', fn($q) => $q->where('slug', 'size'))->get(),
        ];
    }
}
