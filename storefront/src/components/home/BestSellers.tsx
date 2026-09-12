'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import { toCardProduct } from '@/lib/products';
import type { ApiProduct, CardProduct } from '@/lib/products';

export default function BestSellers() {
  const [products, setProducts] = useState<CardProduct[]>([]);

  useEffect(() => {
    api
      .get('/products', { params: { best_seller: 1, per_page: 4 } })
      .then(({ data }) => {
        const list: ApiProduct[] = data.data ?? [];
        setProducts(list.map(toCardProduct));
      })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-display text-navy-800">
                Best Sellers
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Most loved by our customers
              </p>
            </div>
          </div>
          <a
            href="/shop?best_seller=1"
            className="hidden md:inline-flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700"
          >
            See All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} variant="best" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}