'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
  Smartphone,
  Shirt,
  Home,
  HeartPulse,
  Baby,
  Dumbbell,
  BookOpen,
  Gem,
  Boxes,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Shirt,
  Home,
  HeartPulse,
  Baby,
  Dumbbell,
  BookOpen,
  Gem,
};

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  icon?: string | null;
  products_count: number;
}

interface CategoryTile {
  name: string;
  slug: string;
  icon: LucideIcon;
  count: number;
  color: string;
}

const FALLBACK: CategoryTile[] = [
  { name: 'Electronics', slug: 'electronics', icon: Smartphone, count: 0, color: 'bg-blue-50 text-blue-600' },
  { name: 'Fashion', slug: 'fashion', icon: Shirt, count: 0, color: 'bg-pink-50 text-pink-600' },
  { name: 'Home & Living', slug: 'home-living', icon: Home, count: 0, color: 'bg-amber-50 text-amber-600' },
  { name: 'Health', slug: 'health', icon: HeartPulse, count: 0, color: 'bg-red-50 text-red-600' },
  { name: 'Kids', slug: 'kids', icon: Baby, count: 0, color: 'bg-purple-50 text-purple-600' },
  { name: 'Sports', slug: 'sports', icon: Dumbbell, count: 0, color: 'bg-green-50 text-green-600' },
  { name: 'Books', slug: 'books', icon: BookOpen, count: 0, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Jewelry', slug: 'jewelry', icon: Gem, count: 0, color: 'bg-yellow-50 text-yellow-600' },
];

const colors = [
  'bg-blue-50 text-blue-600',
  'bg-pink-50 text-pink-600',
  'bg-amber-50 text-amber-600',
  'bg-red-50 text-red-600',
  'bg-purple-50 text-purple-600',
  'bg-green-50 text-green-600',
  'bg-indigo-50 text-indigo-600',
  'bg-yellow-50 text-yellow-600',
];

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryTile[]>([]);

  useEffect(() => {
    api
      .get('/categories')
      .then(({ data }) => {
        const list: ApiCategory[] = data.data ?? [];
        if (!list.length) return;
        setCategories(
          list.map((cat, i) => ({
            name: cat.name,
            slug: cat.slug,
            icon: (cat.icon && iconMap[cat.icon]) || Boxes,
            count: cat.products_count,
            color: colors[i % colors.length],
          }))
        );
      })
      .catch(() => {});
  }, []);

  const shown = categories.length ? categories : FALLBACK;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-display text-navy-800"
          >
            Shop by Category
          </motion.h2>
          <p className="text-gray-500 mt-3">
            Browse our wide range of categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {shown.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <cat.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-semibold text-navy-800 text-center">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {cat.count.toLocaleString()} items
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}