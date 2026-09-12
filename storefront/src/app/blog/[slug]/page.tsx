'use client';

import { useParams } from 'next/navigation';
import {
  Calendar, Clock, ArrowLeft, Share2, Tag,
  User, ChevronRight, Facebook, Twitter,
} from 'lucide-react';
import Link from 'next/link';

// Mock data — will come from API
const POST = {
  title: '10 Must-Have Gadgets for 2025',
  slug: '10-must-have-gadgets-2025',
  category: { name: 'Tech', slug: 'tech' },
  author: { name: 'Admin', avatar: null },
  date: '2025-01-15',
  readTime: 5,
  views: 2450,
  excerpt: 'Discover the latest tech that will transform your daily life...',
  content: `
    <p>The world of technology is evolving faster than ever, and 2025 brings some incredible innovations that every tech enthusiast should know about. From AI-powered devices to sustainable gadgets, here are our top picks.</p>

    <h2>1. AI-Powered Smart Earbuds</h2>
    <p>The latest generation of wireless earbuds now features real-time language translation, adaptive noise cancellation, and health monitoring. Brands like Samsung and Apple are leading the charge with their Galaxy Buds 3 Pro and AirPods Pro 3.</p>

    <h2>2. Foldable Smartphones</h2>
    <p>Foldable phones have finally matured. The Samsung Galaxy Z Fold 6 and OnePlus Open 2 offer seamless multitasking experiences with crease-free displays and flagship cameras.</p>

    <h2>3. Smart Home Hub with AI</h2>
    <p>The new generation of smart home hubs can understand context, anticipate your needs, and control hundreds of devices with natural language commands.</p>

    <h2>4. Portable Solar Chargers</h2>
    <p>With efficiency rates exceeding 25%, portable solar chargers are now practical for everyday use. Perfect for outdoor enthusiasts and emergency preparedness.</p>

    <h2>5. AR Glasses</h2>
    <p>Lightweight AR glasses are finally here for consumers. Navigate, translate signs in real-time, and get contextual information overlaid on your world.</p>

    <h2>Conclusion</h2>
    <p>2025 is shaping up to be an incredible year for tech. Whether you're a gadget lover or just looking to make your life easier, these innovations are worth exploring.</p>
  `,
  tags: ['Tech', 'Gadgets', '2025', 'AI', 'Smart Home'],
  related: [
    { title: 'Best Smartphones Under ৳30,000', slug: 'best-phones-30k', date: '2025-01-10' },
    { title: 'Smart Home Setup Guide', slug: 'smart-home-guide', date: '2025-01-05' },
    { title: 'Top 5 Wireless Earbuds Compared', slug: 'earbuds-compared', date: '2024-12-28' },
  ],
};

export default function BlogPostPage() {
  const params = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-brand-600">Blog</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/blog?category=${POST.category.slug}`} className="hover:text-brand-600">{POST.category.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-800 font-medium truncate max-w-[200px]">{POST.title}</span>
      </nav>

      <article>
        <header className="mb-8">
          <Link
            href={`/blog?category=${POST.category.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold mb-4 hover:bg-brand-100 transition"
          >
            <Tag className="w-3 h-3" /> {POST.category.name}
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold font-display text-navy-900 leading-tight mb-4">
            {POST.title}
          </h1>

          <p className="text-lg text-gray-500 mb-6">{POST.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-xs">
                {POST.author.name[0]}
              </div>
              <span className="text-navy-800 font-medium">{POST.author.name}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(POST.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {POST.readTime} min read
            </span>
            <span>View {POST.views.toLocaleString()} views</span>
          </div>
        </header>

        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-brand-100 to-brand-300 rounded-2xl flex items-center justify-center mb-10">
          <span className="text-brand-400 text-lg">Featured Image</span>
        </div>

        <div
          className="prose prose-lg max-w-none prose-headings:text-navy-900 prose-headings:font-display prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: POST.content }}
        />

        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
          {POST.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag.toLowerCase()}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-brand-50 hover:text-brand-600 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-6">
          <span className="text-sm text-gray-500">Share:</span>
          <button className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
            <Facebook className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition">
            <Twitter className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </article>

      <section className="mt-16 pt-8 border-t border-gray-100">
        <h2 className="text-2xl font-bold font-display text-navy-900 mb-6">
          Related Articles
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {POST.related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group p-4 bg-gray-50 rounded-xl hover:bg-brand-50 transition"
            >
              <h3 className="text-sm font-semibold text-navy-800 group-hover:text-brand-600 transition line-clamp-2 mb-2">
                {r.title}
              </h3>
              <span className="text-xs text-gray-400">{r.date}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    </div>
  );
}