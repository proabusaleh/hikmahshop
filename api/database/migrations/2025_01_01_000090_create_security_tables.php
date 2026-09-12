<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('action');
            $table->index('model_type');
            $table->index('created_at');
        });

        Schema::create('login_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['success', 'failed', 'locked_out']);
            $table->string('ip_address', 45);
            $table->string('user_agent')->nullable();
            $table->string('device_name')->nullable();
            $table->string('browser')->nullable();
            $table->string('os')->nullable();
            $table->string('location')->nullable();
            $table->string('failure_reason')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('ip_address');
            $table->index('created_at');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('two_factor_enabled')->default(false)->after('status');
            $table->text('two_factor_secret')->nullable()->after('two_factor_enabled');
            $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            $table->timestamp('last_login_at')->nullable()->after('two_factor_confirmed_at');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_enabled', 'two_factor_secret',
                'two_factor_recovery_codes', 'two_factor_confirmed_at',
                'last_login_at', 'last_login_ip',
            ]);
        });
        Schema::dropIfExists('login_history');
        Schema::dropIfExists('audit_logs');
    }
};