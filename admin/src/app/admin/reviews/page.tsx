'use client';

import { useState } from 'react';
import {
  Star, CheckCircle, XCircle, Eye, EyeOff,
  Award, Flag, MessageSquare, Search,
} from 'lucide-react';

const REVIEWS = [
  { id: 1, user: 'Rahim Uddin', product: 'Wireless Earbuds Pro', rating: 5, body: 'Amazing sound quality! Best purchase ever.', status: 'approved', verified: true, reports: 0, helpful: 24, date: '2025-01-14' },
  { id: 2, user: 'Fatima Akter', product: 'Cotton T-Shirt', rating: 3, body: 'Quality is okay but sizing runs small.', status: 'pending', verified: true, reports: 0, helpful: 5, date: '2025-01-14' },
  { id: 3, user: 'Spam User', product: 'Smart Watch', rating: 1, body: 'Buy cheap products from www.fake-site.com!!!', status: 'pending', verified: false, reports: 4, helpful: 0, date: '2025-01-13' },
  { id: 4, user: 'Karim Hasan', product: 'Running Shoes X1', rating: 4, body: 'Very comfortable for daily running. Good grip.', status: 'approved', verified: true, reports: 0, helpful: 12, date: '2025-01-12' },
  { id: 5, user: 'Nusrat Jahan', product: 'Face Serum', rating: 5, body: 'My skin has never looked better! Highly recommended.', status: 'hidden', verified: true, reports: 0, helpful: 8, date: '2025-01-11' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  hidden: 'bg-gray-100 text-gray-600',
};

export default function AdminReviewsPage() {
  const [tab, setTab] = useState('all');

  const filtered = REVIEWS.filter((r) => {
    if (tab === 'all') return true;
    if (tab === 'reported') return r.reports > 0;
    return r.status === tab;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Review Management</h1>
        <p className="text-gray-500 text-sm mt-1">Moderate and manage customer reviews</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-2">
        {['all', 'pending', 'approved', 'rejected', 'hidden', 'reported'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              tab === t ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {t} {t === 'pending' && <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">2</span>}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-navy-800">{review.user}</span>
                  <span className="text-xs text-gray-400">on</span>
                  <span className="text-sm font-medium text-brand-600">{review.product}</span>
                  {review.verified && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">✓ Verified</span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${statusColors[review.status]}`}>
                    {review.status}
                  </span>
                  {review.reports > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                      <Flag className="w-2.5 h-2.5" /> {review.reports} reports
                    </span>
                  )}
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{review.body}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {review.date} • 👍 {review.helpful} helpful
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1 ml-4">
                <button title="Approve" className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition">
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button title="Reject" className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                  <XCircle className="w-4 h-4" />
                </button>
                <button title="Hide" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                  <EyeOff className="w-4 h-4" />
                </button>
                <button title="Feature" className="p-2 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition">
                  <Award className="w-4 h-4" />
                </button>
                <button title="Reply" className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}