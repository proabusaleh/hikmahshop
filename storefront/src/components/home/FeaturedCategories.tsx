'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Smartphone,
  Shirt,
  Home,
  HeartPulse,
  Baby,
  Dumbbell,
  BookOpen,
  Gem,
} from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Smartphone, count: 1240, color: 'bg-blue-50 text-blue-600' },
  { name: 'Fashion', icon: Shirt, count: 3560, color: 'bg-pink-50 text-pink-600' },
  { name: 'Home & Living', icon: Home, count: 890, color: 'bg-amber-50 text-amber-600' },
  { name: 'Health', icon: HeartPulse, count: 456, color: 'bg-red-50 text-red-600' },
  { name: 'Kids', icon: Baby, count: 780, color: 'bg-purple-50 text-purple-600' },
  { name: 'Sports', icon: Dumbbell, count: 320, color: 'bg-green-50 text-green-600' },
  { name: 'Books', icon: BookOpen, count: 1100, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Jewelry', icon: Gem, count: 210, color: 'bg-yellow-50 text-yellow-600' },
];

export default function FeaturedCategories() {
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
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/categories/${cat.name.toLowerCase()}`}
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
