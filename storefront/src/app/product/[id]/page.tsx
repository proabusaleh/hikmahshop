'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star, Heart, ShoppingCart, Zap, Truck, Shield, RotateCcw,
  ChevronRight, Minus, Plus, Share2, Check,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import ReviewSection from '@/components/product/ReviewSection';

const PRODUCT = {
  id: 1,
  name: 'Premium Wireless Noise-Cancelling Headphones Pro Max',
  brand: 'SoundElite',
  price: 4599,
  originalPrice: 7999,
  rating: 4.8,
  reviewCount: 2341,
  sold: 5600,
  stock: 23,
  description:
    'Experience studio-quality sound with our flagship noise-cancelling headphones. Featuring 40mm custom drivers, adaptive ANC, and 30-hour battery life.',
  features: [
    'Active Noise Cancellation (ANC)',
    '40mm Custom Titanium Drivers',
    '30-Hour Battery Life',
    'Bluetooth 5.3 + Multipoint',
    'Foldable Design with Carry Case',
    'Built-in Microphone for Calls',
  ],
  specs: {
    'Driver Size': '40mm',
    'Frequency': '20Hz – 40kHz',
    'Impedance': '32Ω',
    'Battery': '500mAh Li-Po',
    'Charging': 'USB-C (Fast Charge)',
    'Weight': '250g',
    'Bluetooth': '5.3',
    'Codec': 'AAC, SBC, LDAC',
  },
  images: ['1', '2', '3', '4', '5'],
  colors: [
    { name: 'Midnight Black', hex: '#1a1a2e' },
    { name: 'Arctic White', hex: '#f0f0f0' },
    { name: 'Navy Blue', hex: '#1e3a5f' },
    { name: 'Rose Gold', hex: '#b76e79' },
  ],
};

const RELATED = Array.from({ length: 4 }, (_, i) => ({
  id: 200 + i,
  name: ['Earbuds Pro', 'Speaker Mini', 'Gaming Headset', 'Neckband X'][i],
  price: [1299, 2499, 3499, 899][i],
  originalPrice: [1999, 3999, 4999, 1299][i],
  image: '',
  rating: 4.5,
}));

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [liked, setLiked] = useState(false);

  const discount = Math.round(
    ((PRODUCT.originalPrice - PRODUCT.price) / PRODUCT.originalPrice) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-8">
        <a href="/" className="hover:text-brand-600">Home</a>
        <ChevronRight className="w-3 h-3" />
        <a href="/shop" className="hover:text-brand-600">Shop</a>
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-800 font-medium truncate max-w-[200px]">{PRODUCT.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-4 overflow-hidden relative"
          >
            <span className="text-gray-300 text-lg">Product Image {selectedImage + 1}</span>
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                -{discount}%
              </span>
            )}
          </motion.div>

          <div className="flex gap-3">
            {PRODUCT.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center transition ${
                  selectedImage === i
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <span className="text-xs text-gray-400">{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-brand-600 font-semibold mb-1">{PRODUCT.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-navy-800 leading-tight">
            {PRODUCT.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(PRODUCT.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-navy-800">{PRODUCT.rating}</span>
            <span className="text-sm text-gray-400">({PRODUCT.reviewCount.toLocaleString()} reviews)</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-green-600 font-medium">{PRODUCT.sold.toLocaleString()} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-4xl font-bold text-brand-600">
              ৳{PRODUCT.price.toLocaleString()}
            </span>
            <span className="text-xl text-gray-400 line-through">
              ৳{PRODUCT.originalPrice.toLocaleString()}
            </span>
            <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">
              Save ৳{(PRODUCT.originalPrice - PRODUCT.price).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-500 mt-4 leading-relaxed">{PRODUCT.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold text-navy-800 mb-2">
              Color: <span className="text-gray-500 font-normal">{PRODUCT.colors[selectedColor].name}</span>
            </p>
            <div className="flex gap-3">
              {PRODUCT.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === i
                      ? 'border-brand-600 ring-2 ring-brand-200 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-navy-800 mb-2">Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(PRODUCT.stock, quantity + 1))}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="ml-3 text-sm text-gray-400">
              {PRODUCT.stock} items available
            </span>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-200">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="py-4 px-6 bg-navy-800 text-white rounded-xl font-bold hover:bg-navy-900 transition flex items-center gap-2">
              <Zap className="w-5 h-5" /> Buy Now
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`p-4 rounded-xl border-2 transition ${
                liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: Truck, text: 'Free Delivery' },
              { icon: Shield, text: 'Secure Pay' },
              { icon: RotateCcw, text: '7-Day Return' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <badge.icon className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-medium text-gray-600">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex border-b border-gray-200 gap-1">
          {([
            { key: 'desc', label: 'Description' },
            { key: 'specs', label: 'Specifications' },
            { key: 'reviews', label: `Reviews (${PRODUCT.reviewCount})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
                activeTab === tab.key
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'desc' && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed mb-6">{PRODUCT.description}</p>
              <h3 className="font-bold text-navy-800 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {PRODUCT.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full">
                <tbody>
                  {Object.entries(PRODUCT.specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 text-sm font-medium text-navy-800 w-1/3">{key}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewSection
              productId={PRODUCT.id}
              avgRating={PRODUCT.rating}
              reviewCount={PRODUCT.reviewCount}
            />
          )}
        </div>
      </div>

      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-bold font-display text-navy-800 mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RELATED.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
