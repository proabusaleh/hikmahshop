'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-brand-600 to-brand-800">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
          Stay in the Loop
        </h2>
        <p className="text-brand-100 mb-8">
          Subscribe for exclusive deals, new arrivals & 10% off your first order!
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-2 text-white bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Welcome aboard! Check your inbox for the discount code.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 rounded-xl text-navy-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-navy-800 text-white rounded-xl font-semibold hover:bg-navy-900 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
