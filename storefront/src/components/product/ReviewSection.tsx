'use client';

import { useState, useEffect } from 'react';
import {
  Star, ThumbsUp, Flag, CheckCircle, Camera,
  ChevronDown, Filter, MessageSquare, Shield,
} from 'lucide-react';
import api from '@/lib/api';

interface Review {
  id: number;
  user: { name: string; avatar: string | null };
  rating: number;
  title: string | null;
  body: string;
  images: string[] | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  seller_reply: string | null;
  created_at: string;
}

interface Props {
  productId: number;
  avgRating: number;
  reviewCount: number;
}

export default function ReviewSection({ productId, avgRating, reviewCount }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [distribution, setDistribution] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState<number | null>(null);
  const [sort, setSort] = useState('helpful');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, filter, sort, page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params: any = { sort, page };
      if (filter) params.rating = filter;
      const { data } = await api.get(`/products/${productId}/reviews`, { params });
      setReviews(data.data.data);
      setDistribution(data.meta.distribution);
    } catch {}
    setLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', {
        product_id: productId,
        rating: newRating,
        title: newTitle || null,
        body: newBody,
      });
      setShowForm(false);
      setNewRating(0);
      setNewTitle('');
      setNewBody('');
      fetchReviews();
    } catch {}
    setSubmitting(false);
  };

  const handleVote = async (reviewId: number) => {
    try {
      const { data } = await api.post(`/reviews/${reviewId}/vote`, { type: 'helpful' });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, helpful_count: data.data.helpful_count } : r))
      );
    } catch {}
  };

  const totalReviews = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      {/* ── Rating Summary ── */}
      <div className="grid md:grid-cols-3 gap-8 p-6 bg-gray-50 rounded-2xl">
        {/* Big Rating */}
        <div className="text-center">
          <p className="text-6xl font-bold text-navy-900">{avgRating.toFixed(1)}</p>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(avgRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Based on {reviewCount.toLocaleString()} reviews
          </p>
        </div>

        {/* Distribution Bars */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] ?? 0;
            const percent = Math.round((count / totalReviews) * 100);
            return (
              <button
                key={star}
                onClick={() => setFilter(filter === star ? null : star)}
                className={`flex items-center gap-2 w-full group ${
                  filter === star ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-sm text-gray-600 w-3">{star}</span>
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Write Review CTA */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-200"
          >
            ✍️ Write a Review
          </button>
          <p className="text-xs text-gray-400 mt-2">Share your experience</p>
        </div>
      </div>

      {/* ── Review Form ── */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white rounded-2xl border border-brand-200 p-6 space-y-4"
        >
          <h3 className="font-bold text-navy-900">Write Your Review</h3>

          {/* Star Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= newRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 hover:text-yellow-200'
                    }`}
                  />
                </button>
              ))}
              {newRating > 0 && (
                <span className="ml-2 text-sm text-gray-500 self-center">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][newRating]}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Summarize your experience"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
            <textarea
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="What did you like or dislike? (min 10 characters)"
              minLength={10}
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1">{newBody.length}/2000</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || newRating === 0}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition disabled:opacity-40"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Filter & Sort Bar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {filter ? `${filter} Star Reviews` : 'All Reviews'}
          </span>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="text-xs text-brand-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
        >
          <option value="helpful">Most Helpful</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* ── Reviews List ── */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <Star className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No reviews yet. Be the first!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {review.user.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-navy-800 text-sm">{review.user.name}</p>
                      {review.is_verified_purchase && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              {review.title && (
                <h4 className="font-semibold text-navy-800 mb-1">{review.title}</h4>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>

              {/* Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={`/storage/${img}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Seller Reply */}
              {review.seller_reply && (
                <div className="mt-3 p-3 bg-brand-50 rounded-xl border-l-4 border-brand-600">
                  <p className="text-xs font-semibold text-brand-700 mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Seller Response
                  </p>
                  <p className="text-sm text-brand-800">{review.seller_reply}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => handleVote(review.id)}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-brand-600 transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({review.helpful_count})
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition">
                  <Flag className="w-4 h-4" /> Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {reviews.length > 0 && (
        <div className="text-center">
          <button
            onClick={() => setPage(page + 1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            Load More Reviews <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}