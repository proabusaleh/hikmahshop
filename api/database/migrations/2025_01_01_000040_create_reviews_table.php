<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('order_item_id')->nullable()->constrained()->nullOnDelete();

            // Rating
            $table->tinyInteger('rating')->unsigned();

            // Content
            $table->string('title')->nullable();
            $table->text('body');

            // Images
            $table->json('images')->nullable();

            // Verification
            $table->boolean('is_verified_purchase')->default(false);

            // Moderation
            $table->enum('status', ['pending', 'approved', 'rejected', 'hidden'])->default('pending');
            $table->boolean('is_featured')->default(false);
            $table->text('admin_note')->nullable();
            $table->foreignId('moderated_by')->nullable()->constrained('users')->nullOnDelete();

            // Engagement
            $table->unsignedInteger('helpful_count')->default(0);
            $table->unsignedInteger('report_count')->default(0);

            // Reply
            $table->text('seller_reply')->nullable();
            $table->timestamp('replied_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('product_id');
            $table->index('user_id');
            $table->index('status');
            $table->index(['product_id', 'status']);
            $table->unique(['user_id', 'product_id', 'order_item_id'], 'unique_user_product_review');
        });

        // Review helpful votes
        Schema::create('review_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['helpful', 'not_helpful'])->default('helpful');
            $table->timestamps();

            $table->unique(['review_id', 'user_id']);
        });

        // Review reports
        Schema::create('review_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('reason', ['spam', 'inappropriate', 'fake', 'offensive', 'other']);
            $table->text('details')->nullable();
            $table->boolean('resolved')->default(false);
            $table->timestamps();

            $table->unique(['review_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_reports');
        Schema::dropIfExists('review_votes');
        Schema::dropIfExists('reviews');
    }
};
