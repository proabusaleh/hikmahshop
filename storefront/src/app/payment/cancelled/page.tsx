'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, RefreshCw } from 'lucide-react';

export default function PaymentCancelledPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <ArrowLeft className="w-14 h-14 text-orange-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display text-navy-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 mb-8">
          You cancelled the payment. Your order is still pending and can be paid later from your account.
        </p>
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
          href="/account/orders"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition"
        >
          My Orders
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
