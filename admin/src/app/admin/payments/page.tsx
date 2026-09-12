'use client';

import { useState } from 'react';
import {
  Search, Filter, Download, Eye, CreditCard,
  ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react';

const PAYMENTS = [
  { id: 'HS-20250115-A1B2C3', customer: 'Rahim Uddin', method: 'bKash', status: 'paid', txnId: 'TRX-BK-12345', amount: 3385, date: '2025-01-15' },
  { id: 'HS-20250115-D4E5F6', customer: 'Fatima Akter', method: 'sslcommerz', status: 'paid', txnId: 'SSL-67890', amount: 12990, date: '2025-01-15' },
  { id: 'HS-20250115-G7H8I9', customer: 'Karim Hasan', method: 'nagad', status: 'pending', txnId: '—', amount: 899, date: '2025-01-15' },
  { id: 'HS-20250115-J1K2L3', customer: 'Nusrat Jahan', method: 'cod', status: 'pending', txnId: '—', amount: 6750, date: '2025-01-14' },
  { id: 'HS-20250115-M4N5O6', customer: 'Tanvir Alam', method: 'bKash', status: 'failed', txnId: 'TRX-BK-FAIL', amount: 2340, date: '2025-01-14' },
  { id: 'HS-20250114-P7Q8R9', customer: 'Amina Khatun', method: 'sslcommerz', status: 'paid', txnId: 'SSL-54321', amount: 5670, date: '2025-01-14' },
  { id: 'HS-20250114-S1T2U3', customer: 'Jamal Hossain', method: 'nagad', status: 'paid', txnId: 'NGD-98765', amount: 11200, date: '2025-01-13' },
  { id: 'HS-20250113-V4W5X6', customer: 'Rafi Ahmed', method: 'cod', status: 'pending', txnId: '—', amount: 3400, date: '2025-01-13' },
];

const methodColors: Record<string, string> = {
  bkash: 'bg-pink-100 text-pink-700',
  nagad: 'bg-orange-100 text-orange-700',
  sslcommerz: 'bg-blue-100 text-blue-700',
  cod: 'bg-gray-100 text-gray-700',
  rocket: 'bg-purple-100 text-purple-700',
};

const statusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
};

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = PAYMENTS.filter((p) => {
    if (filterMethod !== 'all' && p.method !== filterMethod) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (search && !p.id.toLowerCase().includes(search.toLowerCase()) && !p.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = PAYMENTS.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = PAYMENTS.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Payments & Transactions</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage payment transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">৳{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">৳{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Successful</p>
              <p className="text-2xl font-bold text-navy-900">{PAYMENTS.filter(p => p.status === 'paid').length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-brand-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{PAYMENTS.filter(p => p.status === 'failed').length}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer, txn ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Methods</option>
          <option value="bkash">bKash</option>
          <option value="nagad">Nagad</option>
          <option value="sslcommerz">SSLCOMMERZ</option>
          <option value="cod">COD</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Txn ID</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-3">
                    <a href={`/admin/orders/${payment.id}`} className="font-mono text-sm font-semibold text-brand-600 hover:underline">
                      {payment.id}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-navy-800">{payment.customer}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${methodColors[payment.method] || 'bg-gray-100 text-gray-700'}`}>
                      {payment.method}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {payment.txnId !== '—' ? payment.txnId : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-navy-800 text-right">
                    ৳{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <a
                        href={`/admin/orders/${payment.id}`}
                        className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  p === 1 ? 'bg-brand-600 text-white' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {p}
              </button>
            ))}
            <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
