'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import { toCardProduct } from '@/lib/products';
import type { ApiProduct, CardProduct } from '@/lib/products';

export default function TrendingProducts() {
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    api
      .get('/products', { params: { trending: 1, per_page: 12 } })
      .then(({ data }) => {
        const list: ApiProduct[] = data.data ?? [];
        if (!list.length) return;
        setProducts(list.map(toCardProduct));
        const cats = Array.from(
          new Set(list.map((p) => p.category?.name).filter(Boolean) as string[])
        );
        setCategories(['All', ...cats]);
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeTab === 'All'
      ? products
      : products.filter((p) => p.categoryName === activeTab);

  const shown = filtered.slice(0, 8);

  if (!products.length) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Flame className="w-7 h-7 text-orange-500" />
            <h2 className="text-3xl font-bold font-display text-navy-800">
              Trending Now
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                    : 'bg-white text-gray-600 hover:bg-brand-50 hover:text-brand-600 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {shown.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} variant="trending" />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/shop?trending=1"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-600 hover:text-white transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}