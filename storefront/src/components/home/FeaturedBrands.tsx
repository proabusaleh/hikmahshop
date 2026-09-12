'use client';

import { motion } from 'framer-motion';

const brands = [
  'Samsung', 'Apple', 'Nike', 'Adidas', 'Xiaomi',
  'Sony', 'LG', 'Puma', 'Levi\'s', 'Anker',
];

export default function FeaturedBrands() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold font-display text-navy-800 mb-10">
          Trusted by Top Brands
        </h2>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-12 items-center"
          >
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center hover:border-brand-200 hover:bg-brand-50/50 transition-colors"
              >
                <span className="text-gray-400 font-semibold text-sm">
                  {brand}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
