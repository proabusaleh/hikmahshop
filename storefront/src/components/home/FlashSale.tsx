'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';

const flashProducts = [
  { id: 1, name: 'Wireless Earbuds Pro', price: 1299, originalPrice: 2499, image: '/products/earbuds.jpg', rating: 4.5, sold: 85 },
  { id: 2, name: 'Smart Watch Ultra', price: 3499, originalPrice: 6999, image: '/products/watch.jpg', rating: 4.7, sold: 72 },
  { id: 3, name: 'Running Shoes X1', price: 1899, originalPrice: 3200, image: '/products/shoes.jpg', rating: 4.3, sold: 91 },
  { id: 4, name: 'Backpack Voyager', price: 899, originalPrice: 1599, image: '/products/backpack.jpg', rating: 4.6, sold: 64 },
  { id: 5, name: 'Bluetooth Speaker', price: 799, originalPrice: 1499, image: '/products/speaker.jpg', rating: 4.4, sold: 78 },
];

function useCountdown(targetHours: number) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const end = Date.now() + targetHours * 3600000;
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
  }, [targetHours]);

  return time;
}

export default function FlashSale() {
  const countdown = useCountdown(8);

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
            href="/deals"
            className="inline-flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700 transition"
          >
            View All Deals <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {flashProducts.map((product, i) => (
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
