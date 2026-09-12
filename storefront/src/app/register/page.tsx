'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  ArrowRight, Check, X,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });

  const checks = [
    { label: 'At least 8 characters', pass: form.password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter', pass: /[a-z]/.test(form.password) },
    { label: 'Number', pass: /\d/.test(form.password) },
  ];
  const strength = checks.filter((c) => c.pass).length;
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.data.user, data.data.token);
      localStorage.setItem('hikmah_token', data.data.token);
      router.push('/');
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors) {
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="text-xl font-bold font-display text-navy-800">
            Hikmah<span className="text-brand-600">Shop</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-2xl font-bold font-display text-navy-800 mb-1">
            Create Account
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= strength ? strengthColor : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1">
                    {checks.map((c) => (
                      <p
                        key={c.label}
                        className={`flex items-center gap-1.5 text-xs ${
                          c.pass ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {c.pass ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {c.label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
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
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" required className="accent-brand-600 mt-0.5 rounded" />
              <span>
                I agree to the{' '}
                <a href="/terms" className="text-brand-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-brand-600 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
