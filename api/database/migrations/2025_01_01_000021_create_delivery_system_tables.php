<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('divisions')->nullable();
            $table->text('districts')->nullable();
            $table->decimal('shipping_charge', 12, 2)->default(60);
            $table->decimal('free_shipping_threshold', 12, 2)->nullable();
            $table->integer('estimated_days_min')->default(2);
            $table->integer('estimated_days_max')->default(5);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->string('api_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->string('api_base_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('supported_zones')->nullable();
            $table->timestamps();
        });

        Schema::create('delivery_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('courier_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tracking_number')->nullable();
            $table->string('consignment_id')->nullable();
            $table->enum('status', [
                'pending', 'picked_up', 'in_transit',
                'out_for_delivery', 'delivered', 'failed', 'returned_to_sender',
            ])->default('pending');
            $table->json('tracking_history')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('tracking_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_tracking');
        Schema::dropIfExists('couriers');
        Schema::dropIfExists('delivery_zones');
    }
};
