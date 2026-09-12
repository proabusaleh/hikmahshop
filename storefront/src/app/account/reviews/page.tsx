'use client';

import { Star, Edit2, Trash2, CheckCircle, Package, ThumbsUp } from 'lucide-react';

const MY_REVIEWS = [
  {
    id: 1, product: 'Wireless Earbuds Pro', sku: 'EAR-WLS-001',
    rating: 5, title: 'Best earbuds ever!', body: 'Amazing sound quality and noise cancellation. Battery lasts all day.',
    date: '2025-01-10', verified: true, helpful: 12, status: 'approved',
  },
  {
    id: 2, product: 'Cotton T-Shirt', sku: 'TSH-BLK-001',
    rating: 4, title: 'Good quality, runs small', body: 'Fabric is great but order one size up. Color is exactly as shown.',
    date: '2025-01-05', verified: true, helpful: 8, status: 'approved',
  },
  {
    id: 3, product: 'Smart Watch Ultra', sku: 'WCH-SMT-001',
    rating: 5, title: '', body: 'Premium build quality. All features work perfectly. Worth every taka!',
    date: '2024-12-28', verified: true, helpful: 15, status: 'approved',
  },
  {
    id: 4, product: 'Running Shoes X1', sku: 'SHO-RUN-001',
    rating: 3, title: 'Average', body: 'Comfortable but sole wore out faster than expected.',
    date: '2024-12-20', verified: true, helpful: 3, status: 'pending',
  },
];

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function MyReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">My Reviews</h1>

      <div className="space-y-4">
        {MY_REVIEWS.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-navy-800 text-sm">{review.product}</p>
                  <p className="text-xs text-gray-400 font-mono">{review.sku}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[review.status]}`}>
                {review.status}
              </span>
            </div>

            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            {review.title && (
              <h4 className="font-semibold text-navy-800 text-sm">{review.title}</h4>
            )}
            <p className="text-sm text-gray-600 mt-1">{review.body}</p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{new Date(review.date).toLocaleDateString('en-GB')}</span>
                {review.verified && (
                  <span className="flex items-center gap-0.5 text-green-600">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
                <span className="flex items-center gap-0.5">
                  <ThumbsUp className="w-3 h-3" /> {review.helpful} helpful
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
