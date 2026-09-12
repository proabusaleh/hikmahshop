<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id', 'brand_id', 'warehouse_id',
        'name', 'slug', 'sku', 'short_description', 'description',
        'price', 'cost_price', 'sale_price', 'flash_price', 'flash_start', 'flash_end',
        'stock', 'low_stock_threshold', 'avg_rating', 'review_count', 'sales_count', 'views_count',
        'is_active', 'is_featured', 'is_trending', 'is_new_arrival', 'is_best_seller',
    ];

    protected $casts = [
        'price'       => 'decimal:2',
        'cost_price'  => 'decimal:2',
        'sale_price'  => 'decimal:2',
        'flash_price' => 'decimal:2',
        'flash_start' => 'datetime',
        'flash_end'   => 'datetime',
        'stock'       => 'integer',
        'low_stock_threshold' => 'integer',
        'avg_rating'  => 'float',
        'review_count'=> 'integer',
        'sales_count' => 'integer',
        'views_count' => 'integer',
        'is_active'        => 'boolean',
        'is_featured'      => 'boolean',
        'is_trending'      => 'boolean',
        'is_new_arrival'   => 'boolean',
        'is_best_seller'   => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOnFlashSale(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereNotNull('flash_price')
            ->whereNotNull('flash_start')
            ->whereNotNull('flash_end')
            ->where('flash_start', '<=', now())
            ->where('flash_end', '>=', now());
    }

    public function scopeTrending(Builder $query): Builder
    {
        return $query->where('is_trending', true);
    }

    public function scopeNewArrivals(Builder $query): Builder
    {
        return $query->where('is_new_arrival', true);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function mainImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true)->orderBy('sort_order');
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('status', 'approved');
    }

    public function getEffectivePriceAttribute(): float
    {
        if ($this->flash_price && now()->between($this->flash_start, $this->flash_end)) {
            return (float) $this->flash_price;
        }
        if ($this->sale_price && $this->sale_price < $this->price) {
            return (float) $this->sale_price;
        }
        return (float) $this->price;
    }

    public function getDiscountPercentageAttribute(): ?int
    {
        if ($this->effective_price >= (float) $this->price || (float) $this->price <= 0) {
            return 0;
        }
        return (int) round(((float) $this->price - $this->effective_price) / (float) $this->price * 100);
    }

    public function getIsOnFlashSaleAttribute(): bool
    {
        return $this->flash_price
            && $this->flash_start
            && $this->flash_end
            && now()->between($this->flash_start, $this->flash_end);
    }

    public function getIsInStockAttribute(): bool
    {
        $totalStock = $this->stock;
        if ($this->variants()->exists()) {
            $totalStock = $this->variants()->sum('stock');
        }
        return $totalStock > 0;
    }
}
