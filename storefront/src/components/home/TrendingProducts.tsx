'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

const tabs = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty'];

const products = [
  { id: 10, name: 'Noise Cancelling Headphones', price: 4599, originalPrice: 7999, image: '', rating: 4.8 },
  { id: 11, name: 'Cotton Casual T-Shirt', price: 599, originalPrice: 999, image: '', rating: 4.3 },
  { id: 12, name: 'LED Desk Lamp Smart', price: 1299, image: '', rating: 4.6, isNew: true },
  { id: 13, name: 'Organic Face Serum', price: 899, originalPrice: 1299, image: '', rating: 4.5 },
  { id: 14, name: 'Mechanical Keyboard RGB', price: 3299, image: '', rating: 4.7, isNew: true },
  { id: 15, name: 'Yoga Mat Premium', price: 799, originalPrice: 1199, image: '', rating: 4.4 },
  { id: 16, name: 'Portable Power Bank 20K', price: 1599, originalPrice: 2499, image: '', rating: 4.6 },
  { id: 17, name: 'Denim Jacket Classic', price: 2199, image: '', rating: 4.2 },
];

export default function TrendingProducts() {
  const [activeTab, setActiveTab] = useState('All');

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
            {tabs.map((tab) => (
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
          {products.map((product, i) => (
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
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-600 hover:text-white transition-all"
          >
            View All Products <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
