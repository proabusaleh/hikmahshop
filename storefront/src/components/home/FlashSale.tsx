'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import { toCardProduct } from '@/lib/products';
import type { ApiProduct, CardProduct } from '@/lib/products';

function useFlashCountdown(endsAt?: string) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = endsAt ? new Date(endsAt).getTime() : Date.now() + 8 * 3600000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return time;
}

export default function FlashSale() {
  const [products, setProducts] = useState<CardProduct[]>([]);
  const [flashEnd, setFlashEnd] = useState<string | undefined>(undefined);
  const countdown = useFlashCountdown(flashEnd);

  useEffect(() => {
    api
      .get('/products', { params: { flash_sale: 1, per_page: 5 } })
      .then(({ data }) => {
        const list: ApiProduct[] = data.data ?? [];
        if (!list.length) return;
        setProducts(list.map(toCardProduct));
        const ends = list
          .map((p) => p.flash_end)
          .filter(Boolean)
          .map((e) => new Date(e as string).getTime());
        if (ends.length) {
          const nearest = Math.min(...ends);
          setFlashEnd(new Date(nearest).toISOString());
        }
      })
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-xl">
                <Zap className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold font-display text-navy-800">
                Flash Sale
              </h2>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              {[
                { val: countdown.h, label: 'H' },
                { val: countdown.m, label: 'M' },
                { val: countdown.s, label: 'S' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="bg-navy-800 text-white text-sm font-mono font-bold px-2.5 py-1.5 rounded-lg min-w-[36px] text-center">
                    {String(t.val).padStart(2, '0')}
                  </span>
                  {i < 2 && <span className="text-navy-400 font-bold">:</span>}
                </div>
              ))}
            </div>
          </div>

          <a
            href="/shop?flash_sale=1"
            className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700 transition"
          >
            View All Deals <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} variant="flash" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}