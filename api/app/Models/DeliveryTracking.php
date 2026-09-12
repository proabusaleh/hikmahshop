<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeliveryTracking extends Model
{
    protected $fillable = [
        'order_id', 'courier_id', 'tracking_number',
        'consignment_id', 'status', 'tracking_history', 'delivered_at',
    ];

    protected $casts = [
        'tracking_history' => 'array',
        'delivered_at'     => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }

    public function addTrackingEvent(string $status, string $location, ?string $note = null): void
    {
        $history = $this->tracking_history ?? [];
        $history[] = [
            'status'   => $status,
            'location' => $location,
            'note'     => $note,
            'time'     => now()->toDateTimeString(),
        ];

        $this->update([
            'status'           => $status,
            'tracking_history' => $history,
            'delivered_at'     => $status === 'delivered' ? now() : $this->delivered_at,
        ]);
    }
}
