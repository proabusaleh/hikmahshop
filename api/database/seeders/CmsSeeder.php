<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use App\Models\CmsPage;
use App\Models\Banner;
use App\Models\Faq;
use App\Models\Policy;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $tech = BlogCategory::create(['name' => 'Tech', 'description' => 'Latest technology news and reviews']);
        $fashion = BlogCategory::create(['name' => 'Fashion', 'description' => 'Style tips and trends']);
        $tips = BlogCategory::create(['name' => 'Tips', 'description' => 'Shopping tips and guides']);

        $tags = ['Gadgets', 'AI', 'Fashion', 'Deals', 'Guide', 'Review', '2025', 'Smart Home'];
        foreach ($tags as $tag) {
            BlogTag::create(['name' => $tag]);
        }

        BlogPost::create([
            'author_id'    => 1,
            'category_id'  => $tech->id,
            'title'        => '10 Must-Have Gadgets for 2025',
            'excerpt'      => 'Discover the latest tech that will transform your daily life.',
            'content'      => '<p>The world of technology is evolving faster than ever...</p>',
            'seo_title'    => '10 Must-Have Gadgets for 2025 | HikmahShop Blog',
            'meta_description' => 'Top 10 gadgets you need in 2025 — from AI earbuds to foldable phones.',
            'status'       => 'published',
            'is_featured'  => true,
            'published_at' => now()->subDays(2),
        ]);

        CmsPage::create([
            'title'   => 'About Us',
            'slug'    => 'about',
            'content' => '<h2>Our Story</h2><p>HikmahShop was founded in 2024 with a mission to make online shopping accessible, affordable, and enjoyable for everyone in Bangladesh.</p>',
            'show_in_menu' => true,
            'menu_order'   => 1,
            'status'       => 'published',
        ]);

        CmsPage::create([
            'title'   => 'Contact Us',
            'slug'    => 'contact',
            'content' => '<h2>Get in Touch</h2><p>Email: support@hikmahshop.com<br>Phone: +880 1XXX-XXXXXX<br>Address: Dhaka, Bangladesh</p>',
            'show_in_menu' => true,
            'menu_order'   => 2,
            'status'       => 'published',
        ]);

        Banner::create([
            'title'     => 'Summer Sale 2025',
            'subtitle'  => 'Up to 60% off on all categories',
            'image'     => 'banners/summer-sale.jpg',
            'link_url'  => '/deals',
            'link_text' => 'Shop Now',
            'position'  => 'hero',
            'is_active' => true,
        ]);

        $faqs = [
            ['category' => 'order', 'question' => 'How do I place an order?', 'answer' => 'Browse products, add to cart, checkout, and confirm.'],
            ['category' => 'payment', 'question' => 'What payment methods do you accept?', 'answer' => 'bKash, Nagad, Rocket, Cards, Internet Banking, COD.'],
            ['category' => 'delivery', 'question' => 'How long does delivery take?', 'answer' => 'Dhaka: 1-2 days. Outside: 3-5 days. Remote: 5-7 days.'],
            ['category' => 'return', 'question' => 'What is your return policy?', 'answer' => '7-day easy return. Products must be unused and in original packaging.'],
        ];
        foreach ($faqs as $faq) {
            Faq::create($faq);
        }

        Policy::create([
            'type'           => 'terms',
            'title'          => 'Terms of Service',
            'content'        => '<h2>Terms of Service</h2><p>By using HikmahShop, you agree to these terms...</p>',
            'version'        => '2.1',
            'effective_date' => now(),
        ]);

        Policy::create([
            'type'           => 'privacy',
            'title'          => 'Privacy Policy',
            'content'        => '<h2>Privacy Policy</h2><p>We respect your privacy and are committed to protecting your data...</p>',
            'version'        => '1.5',
            'effective_date' => now(),
        ]);

        Policy::create([
            'type'           => 'return_policy',
            'title'          => 'Return & Refund Policy',
            'content'        => '<h2>Return Policy</h2><p>7-day hassle-free returns on all products...</p>',
            'version'        => '1.2',
            'effective_date' => now(),
        ]);

        Policy::create([
            'type'           => 'shipping_policy',
            'title'          => 'Shipping Policy',
            'content'        => '<h2>Shipping Policy</h2><p>We deliver across Bangladesh via trusted couriers...</p>',
            'version'        => '1.0',
            'effective_date' => now(),
        ]);
    }
}