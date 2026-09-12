<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class BlogTag extends Model
{
    protected $fillable = ['name', 'slug'];

    protected static function booted(): void
    {
        static::creating(function ($tag) {
            if (empty($tag->slug)) $tag->slug = Str::slug($tag->name);
        });
    }

    public function posts()
    {
        return $this->belongsToMany(BlogPost::class, 'blog_post_tag', 'post_id', 'tag_id');
    }
}