<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    protected $fillable = ['name', 'code', 'address', 'city', 'phone', 'manager_id', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}