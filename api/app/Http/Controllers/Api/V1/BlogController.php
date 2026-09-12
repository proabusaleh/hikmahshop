<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    // ── Public: List published posts ──
    public function index(Request $request)
    {
        $query = BlogPost::published()
            ->with(['author:id,name,avatar', 'category:id,name,slug', 'tags'])
            ->select('id', 'title', 'slug', 'excerpt', 'featured_image',
                     'author_id', 'category_id', 'published_at', 'read_time', 'views_count', 'is_featured');

        if ($category = $request->input('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $category));
        }
        if ($tag = $request->input('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $tag));
        }
        if ($search = $request->input('search')) {
            $query->whereFullText(['title', 'excerpt', 'content'], $search);
        }

        $posts = $query->latest('published_at')->paginate(12);

        return response()->json(['success' => true, 'data' => $posts]);
    }

    // ── Public: Single post ──
    public function show(string $slug)
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->with(['author:id,name,avatar', 'category', 'tags'])
            ->firstOrFail();

        $post->increment('views_count');

        $related = BlogPost::published()
            ->where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->select('id', 'title', 'slug', 'featured_image', 'published_at', 'read_time')
            ->limit(3)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'post'    => $post,
                'related' => $related,
                'seo'     => [
                    'title'       => $post->seo_title,
                    'description' => $post->meta_description,
                    'og_image'    => $post->og_image,
                    'canonical'   => $post->canonical_url,
                    'schema'      => $post->schema_markup,
                ],
            ],
        ]);
    }

    // ── Public: Categories ──
    public function categories()
    {
        $categories = BlogCategory::where('is_active', true)
            ->withCount('publishedPosts')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['success' => true, 'data' => $categories]);
    }

    // ── Admin: CRUD ──
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|unique:blog_posts,slug',
            'category_id'      => 'nullable|exists:blog_categories,id',
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'required|string',
            'featured_image'   => 'nullable|image|max:5120',
            'seo_title'        => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords'    => 'nullable|string|max:255',
            'og_image'         => 'nullable|image|max:5120',
            'canonical_url'    => 'nullable|url',
            'status'           => 'in:draft,published,archived',
            'is_featured'      => 'boolean',
            'tags'             => 'nullable|array',
            'tags.*'           => 'string|max:50',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog', 'public');
        }
        if ($request->hasFile('og_image')) {
            $validated['og_image'] = $request->file('og_image')->store('blog/og', 'public');
        }

        $validated['author_id'] = $request->user()->id;
        if (($validated['status'] ?? 'draft') === 'published') {
            $validated['published_at'] = now();
        }

        $tags = $validated['tags'] ?? [];
        unset($validated['tags']);

        $post = BlogPost::create($validated);

        if (!empty($tags)) {
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tag = BlogTag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $post->tags()->sync($tagIds);
        }

        return response()->json([
            'success' => true,
            'data'    => $post->load(['author', 'category', 'tags']),
        ], 201);
    }

    public function update(Request $request, BlogPost $post)
    {
        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'excerpt'          => 'nullable|string|max:500',
            'content'          => 'sometimes|string',
            'featured_image'   => 'nullable|image|max:5120',
            'seo_title'        => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'status'           => 'in:draft,published,archived',
            'is_featured'      => 'boolean',
            'tags'             => 'nullable|array',
        ]);

        if ($request->hasFile('featured_image')) {
            $validated['featured_image'] = $request->file('featured_image')->store('blog', 'public');
        }

        if (($validated['status'] ?? $post->status) === 'published' && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $tags = $validated['tags'] ?? null;
        unset($validated['tags']);

        $post->update($validated);

        if ($tags !== null) {
            $tagIds = [];
            foreach ($tags as $tagName) {
                $tag = BlogTag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $post->tags()->sync($tagIds);
        }

        return response()->json(['success' => true, 'data' => $post->fresh(['author', 'category', 'tags'])]);
    }

    public function destroy(BlogPost $post)
    {
        $post->tags()->detach();
        $post->delete();
        return response()->json(['success' => true, 'message' => 'Post deleted']);
    }
}