<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'variant_id',
        'product_name', 'product_sku', 'variant_name',
        'quantity', 'unit_price', 'discount', 'total',
        'return_status', 'return_reason',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'discount'   => 'decimal:2',
        'total'      => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
