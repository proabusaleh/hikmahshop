<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('blog_categories')->nullOnDelete();

            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('featured_image')->nullable();

            $table->string('seo_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->string('og_image')->nullable();
            $table->string('canonical_url')->nullable();
            $table->json('schema_markup')->nullable();

            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();

            $table->unsignedInteger('views_count')->default(0);
            $table->unsignedInteger('read_time')->default(1);

            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
            $table->index('status');
            $table->index('published_at');
            $table->index('category_id');
            $table->fullText(['title', 'excerpt', 'content']);
        });

        Schema::create('blog_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('blog_post_tag', function (Blueprint $table) {
            $table->foreignId('post_id')->constrained('blog_posts')->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained('blog_tags')->cascadeOnDelete();
            $table->primary(['post_id', 'tag_id']);
        });

        Schema::create('cms_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content');
            $table->string('template')->default('default');
            $table->boolean('show_in_menu')->default(false);
            $table->integer('menu_order')->default(0);

            $table->string('seo_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('canonical_url')->nullable();

            $table->enum('status', ['draft', 'published', 'archived'])->default('published');
            $table->timestamps();
            $table->softDeletes();

            $table->index('slug');
        });

        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('image');
            $table->string('mobile_image')->nullable();
            $table->string('link_url')->nullable();
            $table->string('link_text')->nullable();
            $table->enum('position', ['hero', 'sidebar', 'category', 'popup', 'footer'])->default('hero');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedInteger('clicks_count')->default(0);
            $table->unsignedInteger('impressions_count')->default(0);
            $table->timestamps();

            $table->index('position');
            $table->index('is_active');
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category')->default('general');
            $table->string('question');
            $table->text('answer');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
        });

        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->enum('type', [
                'terms', 'privacy', 'return_policy',
                'shipping_policy', 'refund_policy', 'cookie_policy',
            ])->unique();
            $table->string('title');
            $table->longText('content');
            $table->string('version')->default('1.0');
            $table->timestamp('effective_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policies');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('banners');
        Schema::dropIfExists('cms_pages');
        Schema::dropIfExists('blog_post_tag');
        Schema::dropIfExists('blog_tags');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
    }
};