<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $guard_name = 'sanctum';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'avatar',
        'status',
        'two_factor_enabled',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'two_factor_confirmed_at',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at'       => 'datetime',
        'password'                => 'hashed',
        'two_factor_enabled'      => 'boolean',
        'two_factor_confirmed_at' => 'datetime',
        'last_login_at'           => 'datetime',
    ];
}
