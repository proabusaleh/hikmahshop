<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CmsPage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'slug', 'content', 'template',
        'show_in_menu', 'menu_order',
        'seo_title', 'meta_description', 'og_image', 'canonical_url',
        'status',
    ];

    protected $casts = [
        'show_in_menu' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function ($page) {
            if (empty($page->slug)) $page->slug = Str::slug($page->title);
        });
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeMenuItems($query)
    {
        return $query->published()->where('show_in_menu', true)->orderBy('menu_order');
    }
}