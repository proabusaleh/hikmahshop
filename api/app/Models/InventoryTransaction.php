<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InventoryTransaction extends Model
{
    protected $fillable = [
        'reference', 'type', 'product_id', 'variant_id',
        'warehouse_id', 'supplier_id',
        'quantity', 'previous_stock', 'new_stock',
        'unit_cost', 'total_cost',
        'reason', 'created_by', 'notes',
    ];

    protected $casts = [
        'unit_cost'  => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::creating(function ($txn) {
            if (empty($txn->reference)) {
                $txn->reference = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            }
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}