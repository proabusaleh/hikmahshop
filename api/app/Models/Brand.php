<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name', 'slug', 'logo', 'description', 'website', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
