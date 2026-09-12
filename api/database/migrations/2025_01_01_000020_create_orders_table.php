<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('status', [
                'pending', 'confirmed', 'processing', 'packed', 'shipped',
                'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded',
            ])->default('pending');

            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_charge', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('coupon_discount', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('due_amount', 12, 2)->default(0);

            $table->enum('payment_method', [
                'cod', 'bkash', 'nagad', 'rocket', 'card', 'internet_banking', 'sslcommerz',
            ])->default('cod');
            $table->enum('payment_status', [
                'pending', 'paid', 'failed', 'refunded', 'partial',
            ])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->string('payment_gateway_response')->nullable();

            $table->string('coupon_code')->nullable();
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();

            $table->string('delivery_zone')->nullable();
            $table->string('courier_name')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamp('estimated_delivery')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->text('delivery_note')->nullable();

            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('order_number');
            $table->index('transaction_id');
            $table->index('created_at');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();

            $table->string('product_name');
            $table->string('product_sku');
            $table->string('variant_name')->nullable();

            $table->integer('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            $table->enum('return_status', ['none', 'requested', 'approved', 'rejected', 'returned'])->default('none');
            $table->text('return_reason')->nullable();

            $table->timestamps();

            $table->index('order_id');
            $table->index('product_id');
        });

        Schema::create('order_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['shipping', 'billing'])->default('shipping');

            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('address_line_1');
            $table->string('address_line_2')->nullable();
            $table->string('city');
            $table->string('district');
            $table->string('division');
            $table->string('zip_code')->nullable();
            $table->string('country')->default('Bangladesh');

            $table->timestamps();

            $table->index('order_id');
        });

        Schema::create('order_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_history');
        Schema::dropIfExists('order_addresses');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
