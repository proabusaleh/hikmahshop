'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const POSTS = [
  { id: 1, title: '10 Must-Have Gadgets for 2025', slug: '10-must-have-gadgets-2025', excerpt: 'Discover the latest tech that will transform your daily life...', category: 'Tech', author: 'Admin', date: '2025-01-15', readTime: 5, featured: true, image: null },
  { id: 2, title: 'Summer Fashion Guide: Stay Cool & Stylish', slug: 'summer-fashion-guide', excerpt: 'Expert tips on building the perfect summer wardrobe...', category: 'Fashion', author: 'Sadia', date: '2025-01-12', readTime: 4, featured: false, image: null },
  { id: 3, title: 'How to Save More with HikmahShop Deals', slug: 'save-more-hikmahshop', excerpt: 'A complete guide to maximizing your savings on every order...', category: 'Tips', author: 'Admin', date: '2025-01-10', readTime: 3, featured: false, image: null },
  { id: 4, title: 'Best Skincare Routine for Bangladeshi Weather', slug: 'skincare-bangladesh', excerpt: 'Dermatologist-approved tips for humid weather skincare...', category: 'Health', author: 'Nusrat', date: '2025-01-08', readTime: 6, featured: false, image: null },
];

export default function BlogPage() {
  const [category, setCategory] = useState('all');
  const categories = ['all', 'Tech', 'Fashion', 'Health', 'Tips', 'Guide'];

  const filtered = category === 'all' ? POSTS : POSTS.filter((p) => p.category === category);
  const featured = POSTS.find((p) => p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-navy-900">
          HikmahShop Blog
        </h1>
        <p className="text-gray-500 mt-3 max-w-lg mx-auto">
          Tips, guides, and inspiration for smarter shopping
        </p>
      </div>

      <div className="flex gap-2 justify-center mb-10 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === cat
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-brand-50 hover:text-brand-600'
            }`}
          >
            {cat === 'all' ? 'All Posts' : cat}
          </button>
        ))}
      </div>

      {featured && category === 'all' && (
        <Link
          href={`/blog/${featured.slug}`}
          className="block mb-12 bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow group"
        >
          <div className="grid md:grid-cols-2">
            <div className="h-64 md:h-auto bg-brand-700 flex items-center justify-center">
              <span className="text-white/30 text-lg">Featured Image</span>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center text-white">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 w-fit">
                <Tag className="w-3 h-3" /> {featured.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-3 group-hover:underline">
                {featured.title}
              </h2>
              <p className="text-brand-100 mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-brand-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {featured.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {featured.readTime} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.filter((p) => !p.featured || category !== 'all').map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
              <span className="text-brand-300 text-sm">Blog Cover</span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime} min
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy-800 group-hover:text-brand-600 transition line-clamp-2 mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="text-sm text-brand-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-navy-800 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl font-bold font-display mb-3">
          Never Miss a Post
        </h2>
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Subscribe to our blog for the latest tips, deals, and shopping guides.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 px-5 py-3 rounded-xl text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}