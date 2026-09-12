'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

const newArrivals = [
  { id: 30, name: 'Smart Home Hub Mini', price: 5999, image: '', rating: 4.6, isNew: true },
  { id: 31, name: 'Linen Summer Dress', price: 1899, image: '', rating: 4.4, isNew: true },
  { id: 32, name: 'Ceramic Plant Pot Set', price: 699, image: '', rating: 4.3, isNew: true },
  { id: 33, name: 'Wireless Charging Pad', price: 999, originalPrice: 1499, image: '', rating: 4.5, isNew: true },
  { id: 34, name: 'Bamboo Sunglasses', price: 599, image: '', rating: 4.2, isNew: true },
  { id: 35, name: 'Electric Toothbrush Pro', price: 1499, image: '', rating: 4.7, isNew: true },
  { id: 36, name: 'Canvas Tote Bag', price: 399, image: '', rating: 4.1, isNew: true },
  { id: 37, name: 'Aromatherapy Diffuser', price: 1299, originalPrice: 1999, image: '', rating: 4.6, isNew: true },
];

export default function NewArrivals() {
  return (
    <section className="py-16 bg-gradient-to-b from-brand-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-display text-navy-800">
                New Arrivals
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Fresh drops you'll love
              </p>
            </div>
          </div>
          <a
            href="/new-arrivals"
            className="hidden md:inline-flex items-center gap-1 text-brand-600 font-semibold"
          >
            See All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} variant="new" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
