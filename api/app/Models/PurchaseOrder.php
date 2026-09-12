<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_number', 'supplier_id', 'warehouse_id', 'status',
        'subtotal', 'tax', 'total',
        'order_date', 'expected_date', 'received_date',
        'notes', 'created_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax'      => 'decimal:2',
        'total'    => 'decimal:2',
        'order_date'     => 'date',
        'expected_date'  => 'date',
        'received_date'  => 'date',
    ];

    protected static function booted(): void
    {
        static::creating(function ($po) {
            if (empty($po->po_number)) {
                $po->po_number = 'PO-' . date('Ymd') . '-' . strtoupper(Str::random(3));
            }
        });
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}