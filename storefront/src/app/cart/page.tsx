'use client';

import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, coupon, couponDiscount, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const savings = items.reduce(
    (s, i) => s + (i.originalPrice ? (i.originalPrice - i.price) * i.quantity : 0),
    0
  );
  const delivery = subtotal >= 999 ? 0 : 60;
  const couponAmount = (subtotal * couponDiscount) / 100;
  const total = subtotal - couponAmount + delivery;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-display text-navy-800 mb-8">
        Shopping Cart ({items.length} items)
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                <span className="text-xs text-gray-400">Image</span>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/product/${item.id}`}
                  className="font-semibold text-navy-800 hover:text-brand-600 transition line-clamp-1"
                >
                  {item.name}
                </Link>
                {item.color && (
                  <p className="text-xs text-gray-400 mt-1">Color: {item.color}</p>
                )}

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

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-navy-800">Order Summary</h2>

            {coupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-sm font-medium text-green-700 flex items-center gap-1">
                  <Tag className="w-4 h-4" /> {coupon.toUpperCase()} applied
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  onClick={() => applyCoupon(couponCode)}
                  className="px-4 py-2 bg-navy-800 text-white rounded-xl text-sm font-medium hover:bg-navy-900 transition"
                >
                  Apply
                </button>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Product Savings</span>
                  <span>-৳{savings.toLocaleString()}</span>
                </div>
              )}
              {couponAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({couponDiscount}%)</span>
                  <span>-৳{couponAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Delivery
                </span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                  {delivery === 0 ? 'FREE' : `৳${delivery}`}
                </span>
              </div>
              {delivery > 0 && (
                <p className="text-xs text-gray-400">
                  Add ৳{(999 - subtotal).toLocaleString()} more for free delivery
                </p>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold text-navy-800 pt-2">
                <span>Total</span>
                <span>৳{Math.round(total).toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full py-4 bg-brand-600 text-white text-center rounded-xl font-bold text-lg hover:bg-brand-700 transition shadow-lg shadow-brand-200"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="block text-center text-sm text-gray-500 hover:text-brand-600 transition"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
