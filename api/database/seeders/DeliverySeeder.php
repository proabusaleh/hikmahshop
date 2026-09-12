<?php

namespace Database\Seeders;

use App\Models\DeliveryZone;
use App\Models\Courier;
use Illuminate\Database\Seeder;

class DeliverySeeder extends Seeder
{
    public function run(): void
    {
        DeliveryZone::create([
            'name'                   => 'Inside Dhaka',
            'slug'                   => 'inside-dhaka',
            'divisions'              => ['Dhaka'],
            'districts'              => ['Dhaka', 'Gazipur', 'Narayanganj'],
            'shipping_charge'        => 60,
            'free_shipping_threshold' => 999,
            'estimated_days_min'     => 1,
            'estimated_days_max'     => 2,
            'sort_order'             => 1,
        ]);

        DeliveryZone::create([
            'name'                   => 'Outside Dhaka',
            'slug'                   => 'outside-dhaka',
            'divisions'              => ['Chittagong', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'],
            'districts'              => null,
            'shipping_charge'        => 120,
            'free_shipping_threshold' => 1999,
            'estimated_days_min'     => 3,
            'estimated_days_max'     => 5,
            'sort_order'             => 2,
        ]);

        DeliveryZone::create([
            'name'                   => 'Remote Areas',
            'slug'                   => 'remote-areas',
            'divisions'              => null,
            'districts'              => ['Bandarban', 'Rangamati', 'Khagrachari', 'Bhola'],
            'shipping_charge'        => 200,
            'free_shipping_threshold' => 2999,
            'estimated_days_min'     => 5,
            'estimated_days_max'     => 7,
            'sort_order'             => 3,
        ]);

        $couriers = [
            ['name' => 'Steadfast',   'slug' => 'steadfast',  'website' => 'https://steadfast.com.bd'],
            ['name' => 'Pathao',      'slug' => 'pathao',     'website' => 'https://pathao.com'],
            ['name' => 'RedX',        'slug' => 'redx',       'website' => 'https://redx.com.bd'],
            ['name' => 'Paperfly',    'slug' => 'paperfly',   'website' => 'https://paperfly.com.bd'],
            ['name' => 'eCourier',    'slug' => 'ecourier',   'website' => 'https://ecourier.com.bd'],
            ['name' => 'Sundarban',   'slug' => 'sundarban',  'website' => 'https://sundarbancourier.com.bd'],
        ];

        foreach ($couriers as $courier) {
            Courier::create(array_merge($courier, ['is_active' => true]));
        }
    }
}
