<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    protected $fillable = [
        'name', 'slug', 'is_filterable', 'sort_order',
    ];

    public function values()
    {
        return $this->hasMany(ProductAttributeValue::class, 'attribute_id');
    }
}
