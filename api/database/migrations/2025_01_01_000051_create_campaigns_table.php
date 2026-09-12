<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('banner_image')->nullable();
            $table->string('theme_color', 7)->default('#10b981');
            $table->string('coupon_code')->nullable()->unique();
            $table->decimal('discount_percent', 5, 2)->nullable();
            $table->decimal('discount_amount', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
            $table->index('is_featured');
            $table->index(['starts_at', 'ends_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
