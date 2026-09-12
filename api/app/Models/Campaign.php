<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'description', 'banner_image', 'theme_color',
        'coupon_code', 'discount_percent', 'discount_amount',
        'is_active', 'is_featured', 'sort_order', 'starts_at', 'ends_at',
    ];

    protected $casts = [
        'discount_percent' => 'decimal:2',
        'discount_amount'  => 'decimal:2',
        'is_active'        => 'boolean',
        'is_featured'      => 'boolean',
        'starts_at'        => 'datetime',
        'ends_at'          => 'datetime',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            });
    }
}
