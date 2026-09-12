'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Send } from 'lucide-react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-navy-800">{email}</span>.
                Please check your inbox and spam folder.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-brand-600 font-medium hover:underline"
              >
                Didn't receive it? Try again
              </button>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold font-display text-navy-800 mb-1">
                  Forgot Password?
                </h2>
                <p className="text-gray-500 text-sm">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
