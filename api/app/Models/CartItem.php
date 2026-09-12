<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = ['cart_id', 'product_id', 'variant_id', 'quantity', 'unit_price'];

    protected $casts = ['unit_price' => 'decimal:2'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->with('mainImage');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class)->with('attributeValues.attribute');
    }

    public function getSubtotalAttribute(): float
    {
        return (float) $this->unit_price * $this->quantity;
    }

    public function getCurrentPriceAttribute(): float
    {
        if ($this->variant) {
            return $this->variant->effective_price;
        }
        return $this->product->effective_price;
    }

    public function getHasPriceChangedAttribute(): bool
    {
        return abs($this->current_price - (float) $this->unit_price) > 0.01;
    }
}
