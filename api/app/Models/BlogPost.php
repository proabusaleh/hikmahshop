<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BlogPost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'author_id', 'category_id', 'title', 'slug', 'excerpt', 'content',
        'featured_image', 'seo_title', 'meta_description', 'meta_keywords',
        'og_image', 'canonical_url', 'schema_markup',
        'status', 'is_featured', 'published_at', 'views_count', 'read_time',
    ];

    protected $casts = [
        'schema_markup' => 'array',
        'is_featured'   => 'boolean',
        'published_at'  => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->title) . '-' . Str::random(4);
            }
            if (empty($post->read_time)) {
                $post->read_time = max(1, (int) ceil(str_word_count(strip_tags($post->content)) / 200));
            }
        });
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function tags()
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag', 'post_id', 'tag_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getSeoTitleAttribute(): string
    {
        return $this->attributes['seo_title'] ?? $this->title;
    }

    public function getOgImageAttribute(): ?string
    {
        return $this->attributes['og_image'] ?? $this->featured_image;
    }
}