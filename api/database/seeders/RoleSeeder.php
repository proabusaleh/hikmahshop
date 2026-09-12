<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // ── Reset cache ──
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ── Create Permissions ──
        $permissions = [
            'manage-users', 'manage-products', 'manage-orders',
            'manage-categories', 'manage-coupons', 'manage-reviews',
            'manage-delivery', 'manage-content', 'view-analytics',
            'manage-settings', 'manage-payments',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // ── Create Roles ──
        $roles = [
            'super_admin'      => Permission::all(),
            'admin'            => Permission::all()->except(['manage-settings']),
            'manager'          => ['manage-products', 'manage-orders', 'manage-categories', 'view-analytics'],
            'staff'            => ['manage-products', 'manage-orders'],
            'customer'         => [],
            'delivery_manager' => ['manage-delivery', 'manage-orders'],
            'content_manager'  => ['manage-content', 'manage-reviews'],
        ];

        foreach ($roles as $roleName => $perms) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'sanctum']);
            $role->syncPermissions($perms);
        }
    }
}
