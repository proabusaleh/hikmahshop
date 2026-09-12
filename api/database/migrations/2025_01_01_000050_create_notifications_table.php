<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('read_at');
            $table->index('created_at');
        });

        Schema::create('push_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('platform', ['ios', 'android', 'web']);
            $table->string('token', 500);
            $table->string('device_name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'token']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('push_tokens');
        Schema::dropIfExists('notifications');
    }
};
