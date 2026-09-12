<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number', 'user_id', 'status',
        'subtotal', 'shipping_charge', 'discount', 'coupon_discount', 'tax', 'total',
        'paid_amount', 'due_amount',
        'payment_method', 'payment_status', 'transaction_id', 'payment_gateway_response',
        'coupon_code', 'coupon_id',
        'delivery_zone', 'courier_name', 'tracking_number',
        'estimated_delivery', 'delivered_at', 'delivery_note',
        'customer_note', 'admin_note',
        'confirmed_at', 'shipped_at', 'cancelled_at',
    ];

    protected $casts = [
        'subtotal'           => 'decimal:2',
        'shipping_charge'    => 'decimal:2',
        'discount'           => 'decimal:2',
        'coupon_discount'    => 'decimal:2',
        'tax'                => 'decimal:2',
        'total'              => 'decimal:2',
        'paid_amount'        => 'decimal:2',
        'due_amount'         => 'decimal:2',
        'estimated_delivery' => 'datetime',
        'delivered_at'       => 'datetime',
        'confirmed_at'       => 'datetime',
        'shipped_at'         => 'datetime',
        'cancelled_at'       => 'datetime',
    ];

    const STATUS_FLOW = [
        'pending'          => ['confirmed', 'cancelled'],
        'confirmed'        => ['processing', 'cancelled'],
        'processing'       => ['packed', 'cancelled'],
        'packed'           => ['shipped', 'cancelled'],
        'shipped'          => ['out_for_delivery', 'cancelled'],
        'out_for_delivery' => ['delivered', 'shipped'],
        'delivered'        => ['returned'],
        'cancelled'        => [],
        'returned'         => ['refunded'],
        'refunded'         => [],
    ];

    protected static function booted(): void
    {
        static::creating(function ($order) {
            if (empty($order->order_number)) {
                $order->order_number = 'HS-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->hasOne(OrderAddress::class)->where('type', 'shipping');
    }

    public function billingAddress()
    {
        return $this->hasOne(OrderAddress::class)->where('type', 'billing');
    }

    public function statusHistory()
    {
        return $this->hasMany(OrderStatusHistory::class)->latest();
    }

    public function tracking()
    {
        return $this->hasOne(DeliveryTracking::class);
    }

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        $allowed = self::STATUS_FLOW[$this->status] ?? [];
        return in_array($newStatus, $allowed);
    }

    public function transitionTo(string $newStatus, ?int $changedBy = null, ?string $note = null): bool
    {
        if (!$this->canTransitionTo($newStatus)) {
            return false;
        }

        $oldStatus = $this->status;

        $this->status = $newStatus;

        if ($newStatus === 'confirmed')  $this->confirmed_at = now();
        if ($newStatus === 'shipped')    $this->shipped_at = now();
        if ($newStatus === 'delivered')  $this->delivered_at = now();
        if ($newStatus === 'cancelled')  $this->cancelled_at = now();

        $this->save();

        $this->statusHistory()->create([
            'changed_by'  => $changedBy,
            'from_status' => $oldStatus,
            'to_status'   => $newStatus,
            'note'        => $note,
        ]);

        return true;
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['cancelled', 'refunded']);
    }
}
