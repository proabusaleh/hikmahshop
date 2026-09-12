'use client';

import { useState } from 'react';
import {
  Search, ChevronLeft, ChevronRight, Eye,
} from 'lucide-react';

const ORDERS = [
  { id: 'HS-20250115-7F9K2M', customer: 'Rahim Uddin', phone: '01700-123456', items: 2, total: 3385, payment: 'bKash', status: 'delivered', date: '2025-01-15' },
  { id: 'HS-20250115-2X8L4N', customer: 'Fatima Akter', phone: '01800-654321', items: 1, total: 12990, payment: 'sslcommerz', status: 'shipped', date: '2025-01-15' },
  { id: 'HS-20250115-5Q3T7P', customer: 'Karim Hasan', phone: '01900-111222', items: 3, total: 899, payment: 'nagad', status: 'processing', date: '2025-01-15' },
  { id: 'HS-20250114-8B6C1D', customer: 'Nusrat Jahan', phone: '01600-333444', items: 5, total: 6750, payment: 'cod', status: 'pending', date: '2025-01-14' },
  { id: 'HS-20250114-3V9X2Z', customer: 'Tanvir Alam', phone: '01711-555666', items: 1, total: 2340, payment: 'bKash', status: 'cancelled', date: '2025-01-14' },
  { id: 'HS-20250114-6A4R8E', customer: 'Amina Khatun', phone: '01822-777888', items: 2, total: 5670, payment: 'sslcommerz', status: 'delivered', date: '2025-01-14' },
  { id: 'HS-20250113-1H5W9F', customer: 'Jamal Hossain', phone: '01933-999000', items: 4, total: 11200, payment: 'nagad', status: 'delivered', date: '2025-01-13' },
  { id: 'HS-20250113-9K2M5P', customer: 'Rafi Ahmed', phone: '01644-123987', items: 1, total: 3400, payment: 'cod', status: 'pending', date: '2025-01-13' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = ORDERS.filter((o) => {
    if (status !== 'all' && o.status !== status) return false;
    if (
      search &&
      !o.id.toLowerCase().includes(search.toLowerCase()) &&
      !o.customer.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const counts = ORDERS.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track customer orders</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {STATUS_LABELS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`p-4 rounded-2xl border text-left transition ${
              status === s
                ? 'border-brand-600 bg-brand-50'
                : 'border-gray-100 bg-white hover:shadow-md'
            }`}
          >
            <p className="text-2xl font-bold text-navy-900 capitalize">
              {s === 'all' ? ORDERS.length : counts[s] ?? 0}
            </p>
            <p className="text-sm text-gray-500 capitalize">{s === 'all' ? 'Total' : s}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by order ID or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-navy-800">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.date}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{o.items}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{o.payment}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy-800 text-right">
                    ৳{o.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No orders found</div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-400">Page {page} of 1</p>
          <div className="flex gap-1">
            <button disabled className="p-2 rounded-lg border border-gray-200 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled className="p-2 rounded-lg border border-gray-200 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}