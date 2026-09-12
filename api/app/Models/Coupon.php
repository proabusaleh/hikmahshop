<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'description', 'type', 'value',
        'min_order_amount', 'max_discount',
        'usage_limit', 'usage_count', 'per_user_limit',
        'starts_at', 'expires_at', 'is_active',
    ];

    protected $casts = [
        'value'            => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount'     => 'decimal:2',
        'starts_at'        => 'datetime',
        'expires_at'       => 'datetime',
        'is_active'        => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('usage_count');
    }

    public function isValid(?User $user = null, float $orderAmount = 0): array
    {
        if (!$this->is_active) {
            return ['valid' => false, 'message' => 'Coupon is inactive'];
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return ['valid' => false, 'message' => 'Coupon is not yet active'];
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return ['valid' => false, 'message' => 'Coupon has expired'];
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return ['valid' => false, 'message' => 'Coupon usage limit reached'];
        }

        if ($orderAmount < $this->min_order_amount) {
            return [
                'valid'   => false,
                'message' => "Minimum order amount ৳{$this->min_order_amount} required",
            ];
        }

        if ($user && $this->per_user_limit) {
            $userUsage = $this->users()->where('user_id', $user->id)->first()?->pivot?->usage_count ?? 0;
            if ($userUsage >= $this->per_user_limit) {
                return ['valid' => false, 'message' => 'You have already used this coupon'];
            }
        }

        return ['valid' => true, 'message' => 'Coupon is valid'];
    }

    public function calculateDiscount(float $orderAmount): float
    {
        $discount = $this->type === 'percentage'
            ? ($orderAmount * $this->value) / 100
            : (float) $this->value;

        if ($this->max_discount && $discount > $this->max_discount) {
            $discount = (float) $this->max_discount;
        }

        return min($discount, $orderAmount);
    }
}
