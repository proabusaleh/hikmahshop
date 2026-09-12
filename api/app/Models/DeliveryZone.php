<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryZone extends Model
{
    protected $fillable = [
        'name', 'slug', 'divisions', 'districts',
        'shipping_charge', 'free_shipping_threshold',
        'estimated_days_min', 'estimated_days_max',
        'is_active', 'sort_order',
    ];

    protected $casts = [
        'divisions'             => 'array',
        'districts'             => 'array',
        'shipping_charge'       => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_active'             => 'boolean',
    ];

    public function isFreeShipping(float $orderAmount): bool
    {
        if (!$this->free_shipping_threshold) return false;
        return $orderAmount >= $this->free_shipping_threshold;
    }

    public function getEstimatedDeliveryAttribute(): string
    {
        if ($this->estimated_days_min === $this->estimated_days_max) {
            return "{$this->estimated_days_min} days";
        }
        return "{$this->estimated_days_min}–{$this->estimated_days_max} days";
    }
}
