<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttributeValue extends Model
{
    protected $fillable = [
        'attribute_id', 'variant_id', 'value', 'color_code',
    ];

    public function attribute()
    {
        return $this->belongsTo(ProductAttribute::class, 'attribute_id');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
