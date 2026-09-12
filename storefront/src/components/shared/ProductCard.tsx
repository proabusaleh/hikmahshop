'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold?: number;
  isNew?: boolean;
}

interface Props {
  product: Product;
  variant?: 'default' | 'flash' | 'trending' | 'best' | 'new';
}

export default function ProductCard({ product, variant = 'default' }: Props) {
  const [liked, setLiked] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-100/30 transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Product Image</span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
              NEW
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-full shadow-md transition ${
              liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-brand-600 transition">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Sold Bar (Flash Sale) */}
        {variant === 'flash' && product.sold && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
            <div className="w-full bg-white/30 rounded-full h-1.5">
              <div
                className="bg-red-500 h-1.5 rounded-full"
                style={{ width: `${product.sold}%` }}
              />
            </div>
            <span className="text-white text-[10px] font-medium">
              {product.sold}% sold
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-navy-800 line-clamp-2 group-hover:text-brand-600 transition min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-brand-600">
            ৳{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ৳{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button className="mt-3 w-full py-2 bg-brand-50 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center gap-1.5">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
