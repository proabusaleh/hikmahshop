'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home, Phone } from 'lucide-react';

export default function PaymentFailedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <XCircle className="w-14 h-14 text-red-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display text-navy-800 mb-2">
          Payment Failed 😞
        </h1>
        <p className="text-gray-500 mb-8">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl border border-gray-100 p-8 text-left space-y-4 mb-8"
      >
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-brand-600 mt-0.5" />
          <div>
            <p className="font-semibold text-navy-800 text-sm">Need Help?</p>
            <p className="text-gray-500 text-sm">Contact us at support@hikmahshop.com or call 01700-000000</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Link>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition"
        >
          Back to Cart
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-500 hover:text-navy-800 transition"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
      </motion.div>
    </div>
  );
}
