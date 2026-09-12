'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle, Package, Truck, Phone, Mail,
  ArrowRight, Home, Loader2,
} from 'lucide-react';
import api from '@/lib/api';

interface OrderData {
  order_number: string;
  status: string;
  total: number;
  payment_method: string;
  payment_status: string;
  estimated_delivery: string;
  shipping_address?: {
    name: string;
    phone: string;
    address_line_1: string;
    city: string;
    district: string;
    division: string;
  };
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderNumber = params.get('order');
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    api.get(`/orders/${orderNumber}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-800">Order not found</h2>
        <Link href="/shop" className="text-brand-600 mt-4 inline-block hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-14 h-14 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h1 className="text-3xl font-bold font-display text-navy-800 mb-2">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-gray-500 mb-8">
          Thank you for shopping with HikmahShop. Your order is being processed.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl border border-gray-100 p-8 text-left space-y-6 mb-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-xl font-bold text-brand-600 font-mono">{order.order_number}</p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
            {order.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-800 text-sm">Estimated Delivery</p>
              <p className="text-gray-500 text-sm">
                {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString('en-GB') : '2–4 Business Days'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-800 text-sm">Payment Method</p>
              <p className="text-gray-500 text-sm capitalize">{order.payment_method.replace('_', ' ')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-800 text-sm">Track Order</p>
              <p className="text-gray-500 text-sm">SMS updates will be sent</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-600 mt-0.5" />
            <div>
              <p className="font-semibold text-navy-800 text-sm">Confirmation</p>
              <p className="text-gray-500 text-sm">Email sent to your inbox</p>
            </div>
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
          href={`/order/${order.order_number}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          <Package className="w-4 h-4" /> Track Order
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-brand-600 text-brand-600 rounded-xl font-semibold hover:bg-brand-50 transition"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
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
