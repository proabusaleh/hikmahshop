'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love for later.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-display text-navy-800 mb-8">
        My Wishlist ({items.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group"
          >
            <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
              <span className="text-gray-300 text-sm">Image</span>
              <button
                onClick={() => remove(item.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <Link href={`/product/${item.id}`}>
                <h3 className="text-sm font-medium text-navy-800 line-clamp-2 hover:text-brand-600 min-h-[2.5rem]">
                  {item.name}
                </h3>
              </Link>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-bold text-brand-600">
                  ৳{item.price.toLocaleString()}
                </span>
                {item.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ৳{item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <button
                onClick={() =>
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    image: item.image,
                  })
                }
                className="mt-3 w-full py-2 bg-brand-50 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-600 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
