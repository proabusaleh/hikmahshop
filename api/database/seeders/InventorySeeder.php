<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Warehouse;
use App\Models\Supplier;
use App\Models\Product;
use App\Models\InventoryTransaction;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        // ── Ensure a user exists for created_by FK ──
        $admin = User::firstOrCreate(
            ['email' => 'admin@hikmahshop.com'],
            ['name' => 'Admin', 'password' => 'password', 'status' => 'active']
        );
        if (!$admin->hasRole('super_admin')) {
            $admin->assignRole(Role::findByName('super_admin', 'sanctum'));
        }

        // ── Warehouses ──
        $dhaka = Warehouse::firstOrCreate(
            ['code' => 'WH-DHK-01'],
            [
                'name'    => 'Dhaka Central Warehouse',
                'address' => 'Tejgaon Industrial Area, Dhaka',
                'city'    => 'Dhaka',
                'phone'   => '+880 2-9876543',
            ]
        );

        $ctg = Warehouse::firstOrCreate(
            ['code' => 'WH-CTG-01'],
            [
                'name'    => 'Chittagong Hub',
                'address' => 'Agrabad Commercial Area, Chittagong',
                'city'    => 'Chittagong',
                'phone'   => '+880 31-765432',
            ]
        );

        // ── Suppliers ──
        $supplier1 = Supplier::firstOrCreate(
            ['code' => 'SUP-TSB-01'],
            [
                'name'           => 'TechSource BD',
                'contact_person' => 'Mr. Kamal',
                'email'          => 'kamal@techsource.com.bd',
                'phone'          => '+880 1711-222333',
                'address'        => 'Multiplan Center, Elephant Road, Dhaka',
            ]
        );

        $supplier2 = Supplier::firstOrCreate(
            ['code' => 'SUP-FHW-01'],
            [
                'name'           => 'FashionHub Wholesale',
                'contact_person' => 'Mrs. Rina',
                'email'          => 'rina@fashionhub.com.bd',
                'phone'          => '+880 1812-444555',
                'address'        => 'Bangabazar, Dhaka',
            ]
        );

        // ── Assign warehouses to products ──
        Product::where('category_id', 1)->update(['warehouse_id' => $dhaka->id]);
        Product::where('category_id', 2)->update(['warehouse_id' => $dhaka->id]);

        // ── Sample inventory transactions ──
        $products = Product::limit(5)->get();
        $types = ['stock_in', 'stock_in', 'stock_out', 'adjustment'];

        foreach ($products as $product) {
            $type = $types[array_rand($types)];
            $qty = rand(10, 100);
            $prevStock = $product->stock;

            $newStock = match ($type) {
                'stock_in'   => $prevStock + $qty,
                'stock_out'  => max(0, $prevStock - $qty),
                'adjustment' => rand(5, 50),
                default      => $prevStock,
            };

            InventoryTransaction::create([
                'type'           => $type,
                'product_id'     => $product->id,
                'warehouse_id'   => $dhaka->id,
                'supplier_id'    => $type === 'stock_in' ? $supplier1->id : null,
                'quantity'       => $type === 'stock_out' ? -$qty : $qty,
                'previous_stock' => $prevStock,
                'new_stock'      => $newStock,
                'unit_cost'      => $product->cost_price,
                'total_cost'     => $product->cost_price ? $product->cost_price * $qty : null,
                'reason'         => match ($type) {
                    'stock_in'   => 'Purchase order delivery',
                    'stock_out'  => 'Order fulfillment',
                    'adjustment' => 'Physical count correction',
                    default      => 'Manual',
                },
                'created_by' => $admin->id,
            ]);

            $product->update(['stock' => $newStock]);
        }
    }
}