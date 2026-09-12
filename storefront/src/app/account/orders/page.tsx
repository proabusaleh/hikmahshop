'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package, Clock, Truck, CheckCircle, XCircle,
  ChevronRight, Search, RotateCcw,
} from 'lucide-react';

const ORDERS = [
  { id: 'HS-20250115-A1B2C3', status: 'shipped', items: 3, total: 3385, date: '2025-01-15', payment: 'bKash', products: ['Wireless Earbuds Pro', 'Phone Case', 'USB-C Cable'] },
  { id: 'HS-20250112-D4E5F6', status: 'delivered', items: 1, total: 1299, date: '2025-01-12', payment: 'COD', products: ['Running Shoes X1'] },
  { id: 'HS-20250108-G7H8I9', status: 'processing', items: 5, total: 8950, date: '2025-01-08', payment: 'Card', products: ['Smart Watch Ultra', 'Earbuds', 'Charger', 'Case', 'Screen Guard'] },
  { id: 'HS-20250102-J1K2L3', status: 'delivered', items: 2, total: 2198, date: '2025-01-02', payment: 'Nagad', products: ['Cotton T-Shirt ×2'] },
  { id: 'HS-20241225-M4N5O6', status: 'cancelled', items: 1, total: 4599, date: '2024-12-25', payment: 'bKash', products: ['Headphones Pro'] },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  pending:    { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Package,     color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Processing' },
  shipped:    { icon: Truck,       color: 'text-cyan-600',   bg: 'bg-cyan-100',   label: 'Shipped' },
  delivered:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-100',  label: 'Delivered' },
  cancelled:  { icon: XCircle,     color: 'text-red-600',    bg: 'bg-red-100',    label: 'Cancelled' },
};

export default function MyOrdersPage() {
  const [filter, setFilter] = useState('all');

  const filtered = ORDERS.filter((o) => filter === 'all' || o.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">My Orders</h1>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === s
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All' : statusConfig[s]?.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {filtered.map((order) => {
          const config = statusConfig[order.status];
          const Icon = config.icon;
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-navy-800">{order.id}</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                    <Icon className="w-3 h-3" /> {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(order.date).toLocaleDateString('en-GB')}</span>
                  <span>•</span>
                  <span>{order.payment}</span>
                </div>
              </div>

              {/* Products */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{order.items} items</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {order.products.join(', ')}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <span className="text-lg font-bold text-navy-800">
                  ৳{order.total.toLocaleString()}
                </span>
                <div className="flex gap-2">
                  {order.status === 'delivered' && (
                    <button className="px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" /> Reorder
                    </button>
                  )}
                  <Link
                    href={`/order/${order.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                  >
                    View Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}