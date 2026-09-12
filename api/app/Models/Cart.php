<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = ['user_id', 'session_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function getSubtotalAttribute(): float
    {
        return (float) $this->items->sum(fn($item) => $item->unit_price * $item->quantity);
    }

    public function getTotalItemsAttribute(): int
    {
        return (int) $this->items->sum('quantity');
    }
}
