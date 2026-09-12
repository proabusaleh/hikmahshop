<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        /* Create warehouses */
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('phone')->nullable();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('inventory_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->enum('type', ['stock_in', 'stock_out', 'adjustment', 'return', 'transfer', 'purchase']);
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();

            $table->integer('quantity');
            $table->integer('previous_stock');
            $table->integer('new_stock');

            $table->decimal('unit_cost', 12, 2)->nullable();
            $table->decimal('total_cost', 12, 2)->nullable();

            $table->text('reason')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('product_id');
            $table->index('type');
            $table->index('created_at');
            $table->index('warehouse_id');
        });

        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->id();
            $table->string('po_number')->unique();
            $table->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();

            $table->enum('status', ['draft', 'pending', 'approved', 'ordered', 'partial', 'received', 'cancelled'])->default('draft');

            $table->decimal('subtotal', 14, 2)->default(0);
            $table->decimal('tax', 14, 2)->default(0);
            $table->decimal('total', 14, 2)->default(0);

            $table->date('order_date');
            $table->date('expected_date')->nullable();
            $table->date('received_date')->nullable();

            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index('supplier_id');
            $table->index('status');
        });

        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();

            $table->integer('quantity_ordered');
            $table->integer('quantity_received')->default(0);
            $table->decimal('unit_cost', 12, 2);
            $table->decimal('total_cost', 12, 2);

            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('warehouse_id')->nullable()->after('brand_id')->constrained()->nullOnDelete();
            $table->integer('low_stock_threshold')->default(10)->after('stock');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropColumn(['warehouse_id', 'low_stock_threshold']);
        });
        Schema::dropIfExists('purchase_order_items');
        Schema::dropIfExists('purchase_orders');
        Schema::dropIfExists('inventory_transactions');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('warehouses');
    }
};