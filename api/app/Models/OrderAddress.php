<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderAddress extends Model
{
    protected $fillable = [
        'order_id', 'type',
        'name', 'phone', 'email',
        'address_line_1', 'address_line_2',
        'city', 'district', 'division', 'zip_code', 'country',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->district,
            $this->division,
            $this->zip_code,
            $this->country,
        ]);
        return implode(', ', $parts);
    }
}
