'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface BlogPostCard {
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string | null;
  published_at?: string | null;
  read_time?: number;
  category?: { name: string } | null;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPostCard[]>([]);

  useEffect(() => {
    api
      .get('/blog', { params: { per_page: 12 } })
      .then(({ data }) => {
        const list: BlogPostCard[] = data.data?.data ?? data.data ?? [];
        setPosts(list.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (!posts.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-display text-navy-800">
              From Our Blog
            </h2>
            <p className="text-gray-500 mt-1">Tips, guides & inspiration</p>
          </div>
          <Link href="/blog" className="hidden md:inline-flex items-center gap-1 text-brand-600 font-semibold">
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <span className="text-brand-400 text-sm">Blog Cover</span>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                  {post.category?.name ?? 'Blog'}
                </span>
                <h3 className="mt-3 text-lg font-bold text-navy-800 group-hover:text-brand-600 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                  {post.published_at && (
                    <span>
                      {new Date(post.published_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {post.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.read_time} min
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}