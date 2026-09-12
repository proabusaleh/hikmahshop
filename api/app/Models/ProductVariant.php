<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = [
        'product_id', 'name', 'sku', 'price', 'stock', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'price'     => 'decimal:2',
        'stock'     => 'integer',
        'is_active' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function attributeValues()
    {
        return $this->hasMany(ProductAttributeValue::class, 'variant_id');
    }

    public function getEffectivePriceAttribute(): float
    {
        return (float) ($this->price ?? $this->product->price);
    }
}
