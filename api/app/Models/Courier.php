<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Courier extends Model
{
    protected $fillable = [
        'name', 'slug', 'logo', 'website',
        'api_key', 'api_secret', 'api_base_url',
        'is_active', 'supported_zones',
    ];

    protected $casts = [
        'is_active'       => 'boolean',
        'supported_zones' => 'array',
    ];

    protected $hidden = ['api_key', 'api_secret'];

    public function tracking()
    {
        return $this->hasMany(DeliveryTracking::class);
    }
}
