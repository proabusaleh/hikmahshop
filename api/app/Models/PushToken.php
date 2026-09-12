<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PushToken extends Model
{
    protected $fillable = ['user_id', 'platform', 'token', 'device_name', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
