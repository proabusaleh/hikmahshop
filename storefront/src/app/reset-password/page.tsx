'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [form, setForm] = useState({ password: '', password_confirmation: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed. Link may be expired.');
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
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {success ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">
                Password Reset Successful
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
              >
                Go to Login <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-display text-navy-800 mb-1 text-center">
                Set New Password
              </h2>
              <p className="text-gray-500 text-sm text-center mb-6">
                Create a strong password for your account
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={show ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={form.password_confirmation}
                      onChange={(e) =>
                        setForm({ ...form, password_confirmation: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="••••••••"
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
                    'Reset Password'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
