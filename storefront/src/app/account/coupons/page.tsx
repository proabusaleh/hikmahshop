'use client';

import { useState } from 'react';
import { Tag, CheckCircle, Copy, Clock, ShoppingBag } from 'lucide-react';

const COUPONS = [
  { code: 'WELCOME10', type: '10% OFF', desc: '10% off your first order', minOrder: 500, maxDiscount: 200, expires: 'Mar 31, 2025', used: false },
  { code: 'SAVE200', type: '৳200 OFF', desc: 'Flat ৳200 off on orders over ৳1,500', minOrder: 1500, maxDiscount: 200, expires: 'Apr 30, 2025', used: false },
  { code: 'FREESHIP', type: 'Free Shipping', desc: 'Free delivery on any order', minOrder: 999, maxDiscount: null, expires: 'Feb 28, 2025', used: false },
  { code: 'SALE50', type: '50% OFF', desc: '50% off on selected electronics', minOrder: 2000, maxDiscount: 1000, expires: 'Jan 31, 2025', used: true },
];

export default function MyCouponsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const active = COUPONS.filter((c) => !c.used);
  const used = COUPONS.filter((c) => c.used);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">My Coupons</h1>

      <div>
        <h2 className="font-semibold text-navy-800 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-brand-600" /> Active Coupons ({active.length})
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {active.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-2xl border border-brand-200 overflow-hidden relative"
            >
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-brand-600" />

              <div className="p-5 pl-7">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-brand-600">{coupon.type}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{coupon.desc}</p>
                  </div>
                  <button
                    onClick={() => copyCode(coupon.code)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-lg text-xs font-bold hover:bg-brand-100 transition"
                  >
                    {copied === coupon.code ? (
                      <><CheckCircle className="w-3 h-3" /> Copied!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> {coupon.code}</>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>Min: ৳{coupon.minOrder}</span>
                  {coupon.maxDiscount && <span>Max: ৳{coupon.maxDiscount}</span>}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {coupon.expires}
                  </span>
                </div>

                <a
                  href="/shop"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-brand-600 hover:underline"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Shop Now
                </a>
              </div>

              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {used.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-400 mb-3">Used Coupons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {used.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-5 opacity-60"
              >
                <p className="text-lg font-bold text-gray-400 line-through">{coupon.type}</p>
                <p className="text-sm text-gray-400">{coupon.desc}</p>
                <p className="text-xs text-gray-400 mt-2 font-mono">{coupon.code}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-200 text-gray-500 text-[10px] rounded-full font-bold">
                  USED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
