<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use App\Models\Banner;
use App\Models\Faq;
use App\Models\Policy;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    // ══════════════════════════════════════
    //  PAGES
    // ══════════════════════════════════════

    public function page(string $slug)
    {
        $page = CmsPage::published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'success' => true,
            'data'    => $page,
            'seo'     => [
                'title'       => $page->seo_title ?? $page->title,
                'description' => $page->meta_description,
                'og_image'    => $page->og_image,
            ],
        ]);
    }

    public function menuPages()
    {
        return response()->json([
            'success' => true,
            'data'    => CmsPage::menuItems()->select('id', 'title', 'slug', 'menu_order')->get(),
        ]);
    }

    public function storePage(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'slug'             => 'nullable|string|unique:cms_pages,slug',
            'content'          => 'required|string',
            'template'         => 'in:default,full-width,sidebar',
            'show_in_menu'     => 'boolean',
            'menu_order'       => 'integer',
            'seo_title'        => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'status'           => 'in:draft,published,archived',
        ]);

        return response()->json([
            'success' => true,
            'data'    => CmsPage::create($validated),
        ], 201);
    }

    public function updatePage(Request $request, CmsPage $page)
    {
        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'content'          => 'sometimes|string',
            'template'         => 'in:default,full-width,sidebar',
            'show_in_menu'     => 'boolean',
            'seo_title'        => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'status'           => 'in:draft,published,archived',
        ]);

        $page->update($validated);
        return response()->json(['success' => true, 'data' => $page]);
    }

    // ══════════════════════════════════════
    //  BANNERS
    // ══════════════════════════════════════

    public function banners(string $position = 'hero')
    {
        $banners = Banner::active()
            ->position($position)
            ->orderBy('sort_order')
            ->get();

        foreach ($banners as $banner) {
            $banner->increment('impressions_count');
        }

        return response()->json(['success' => true, 'data' => $banners]);
    }

    public function storeBanner(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'subtitle'     => 'nullable|string|max:255',
            'image'        => 'required|image|max:5120',
            'mobile_image' => 'nullable|image|max:2048',
            'link_url'     => 'nullable|url',
            'link_text'    => 'nullable|string|max:100',
            'position'     => 'in:hero,sidebar,category,popup,footer',
            'sort_order'   => 'integer',
            'is_active'    => 'boolean',
            'starts_at'    => 'nullable|date',
            'ends_at'      => 'nullable|date|after:starts_at',
        ]);

        $validated['image'] = $request->file('image')->store('banners', 'public');
        if ($request->hasFile('mobile_image')) {
            $validated['mobile_image'] = $request->file('mobile_image')->store('banners', 'public');
        }

        return response()->json([
            'success' => true,
            'data'    => Banner::create($validated),
        ], 201);
    }

    // ══════════════════════════════════════
    //  FAQ
    // ══════════════════════════════════════

    public function faqs(Request $request)
    {
        $query = Faq::active()->orderBy('sort_order');
        if ($category = $request->input('category')) {
            $query->category($category);
        }
        return response()->json(['success' => true, 'data' => $query->get()]);
    }

    public function storeFaq(Request $request)
    {
        $validated = $request->validate([
            'category'   => 'required|string|max:50',
            'question'   => 'required|string|max:500',
            'answer'     => 'required|string',
            'sort_order' => 'integer',
            'is_active'  => 'boolean',
        ]);

        return response()->json([
            'success' => true,
            'data'    => Faq::create($validated),
        ], 201);
    }

    // ══════════════════════════════════════
    //  POLICIES
    // ══════════════════════════════════════

    public function policy(string $type)
    {
        $policy = Policy::where('type', $type)->firstOrFail();
        return response()->json(['success' => true, 'data' => $policy]);
    }

    public function updatePolicy(Request $request, string $type)
    {
        $validated = $request->validate([
            'title'          => 'sometimes|string|max:255',
            'content'        => 'sometimes|string',
            'version'        => 'sometimes|string|max:20',
            'effective_date' => 'nullable|date',
        ]);

        $policy = Policy::updateOrCreate(['type' => $type], $validated);

        return response()->json(['success' => true, 'data' => $policy]);
    }
}