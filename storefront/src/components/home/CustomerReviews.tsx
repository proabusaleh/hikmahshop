'use client';

import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Fatima Rahman',
    location: 'Dhaka',
    rating: 5,
    text: 'Amazing quality products and super fast delivery! HikmahShop has become my go-to for everything.',
    avatar: 'FR',
  },
  {
    name: 'Arif Hossain',
    location: 'Chittagong',
    rating: 5,
    text: 'The customer service is exceptional. Had an issue with my order and it was resolved within hours.',
    avatar: 'AH',
  },
  {
    name: 'Nusrat Jahan',
    location: 'Sylhet',
    rating: 4,
    text: 'Great deals and genuine products. The flash sales are absolutely worth it!',
    avatar: 'NJ',
  },
];

export default function CustomerReviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold font-display text-navy-800 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Real reviews from real shoppers
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-brand-100" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-navy-800">{review.name}</h4>
                  <p className="text-xs text-gray-400">{review.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
