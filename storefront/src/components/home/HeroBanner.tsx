'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'New Collection 2025',
    title: 'Summer Sale\nUp to 60% Off',
    description: 'Discover premium products at unbeatable prices. Limited time offer!',
    cta: 'Shop Now',
    bg: 'from-brand-900 via-brand-700 to-brand-500',
    image: '/hero/summer-sale.png',
  },
  {
    id: 2,
    tag: 'Trending Now',
    title: 'Smart Electronics\nBest Deals',
    description: 'Latest gadgets and electronics with free delivery nationwide.',
    cta: 'Explore Deals',
    bg: 'from-navy-900 via-navy-800 to-navy-700',
    image: '/hero/electronics.png',
  },
  {
    id: 3,
    tag: 'Exclusive Offer',
    title: 'Fashion Week\nSpecial Collection',
    description: 'Premium brands, exclusive designs. Refresh your wardrobe today.',
    cta: 'View Collection',
    bg: 'from-purple-900 via-purple-700 to-brand-600',
    image: '/hero/fashion.png',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative bg-gradient-to-r ${slide.bg} min-h-[500px] md:min-h-[600px] flex items-center`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full blur-2xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-0 w-full grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white"
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                🔥 {slide.tag}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight whitespace-pre-line mb-6">
                {slide.title}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-md">
                {slide.description}
              </p>
              <button className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-brand-50 transition-all shadow-lg shadow-black/20">
                {slide.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="hidden md:flex justify-center"
            >
              <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 flex items-center justify-center">
                <span className="text-white/50 text-sm">Hero Image</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
