<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id', 'product_id', 'price_when_added',
        'price_drop_alert', 'stock_alert',
    ];

    protected $casts = [
        'price_when_added' => 'decimal:2',
        'price_drop_alert' => 'boolean',
        'stock_alert'      => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->with(['mainImage', 'category', 'brand']);
    }

    public function getCurrentPriceAttribute(): float
    {
        return $this->product->effective_price;
    }

    public function getHasPriceDroppedAttribute(): bool
    {
        return $this->current_price < (float) $this->price_when_added;
    }

    public function getPriceDropPercentageAttribute(): int
    {
        if (!$this->has_price_dropped) return 0;
        return (int) round(
            (((float) $this->price_when_added - $this->current_price) / (float) $this->price_when_added) * 100
        );
    }

    public function getIsBackInStockAttribute(): bool
    {
        return $this->product->is_in_stock;
    }
}
