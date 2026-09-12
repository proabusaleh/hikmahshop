'use client';

import { useState } from 'react';
import { Search, Plus, Tag, Copy } from 'lucide-react';

const COUPONS = [
  { code: 'SAVE10', type: 'percentage', value: 10, min: 0, usage: 1284, limit: 5000, status: 'active', expires: '2025-12-31' },
  { code: 'WELCOME50', type: 'fixed', value: 50, min: 1000, usage: 320, limit: 10000, status: 'active', expires: '2025-06-30' },
  { code: 'EID2025', type: 'percentage', value: 15, min: 3000, usage: 415, limit: 2000, status: 'active', expires: '2025-07-15' },
  { code: 'FREE_SHIP', type: 'shipping', value: 0, min: 500, usage: 892, limit: 0, status: 'active', expires: null },
  { code: 'FLASH20', type: 'percentage', value: 20, min: 0, usage: 0, limit: 500, status: 'inactive', expires: '2025-01-31' },
];

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');

  const filtered = COUPONS.filter(
    (c) => !search || c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount coupons</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search coupon code..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium text-right">Min Order</th>
                <th className="px-4 py-3 font-medium text-right">Used</th>
                <th className="px-4 py-3 font-medium">Expires</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.code} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-600" />
                      <span className="text-sm font-bold text-navy-800 font-mono">{c.code}</span>
                      <Copy className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500 cursor-pointer" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-brand-600">
                    {c.type === 'percentage' && `${c.value}%`}
                    {c.type === 'fixed' && `৳${c.value}`}
                    {c.type === 'shipping' && 'Free Shipping'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {c.min > 0 ? `৳${c.min.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {c.limit > 0 ? `${c.usage} / ${c.limit}` : c.usage}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{c.expires ?? 'Never'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No coupons found</div>
        )}
      </div>
    </div>
  );
}