'use client';

import { useState } from 'react';
import { Search, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const CUSTOMERS = [
  { name: 'Rahim Uddin', email: 'rahim.uddin@gmail.com', phone: '01700-123456', orders: 12, spent: 45800, joined: '2024-03-15', status: 'active' },
  { name: 'Fatima Akter', email: 'fatima.akter@outlook.com', phone: '01800-654321', orders: 8, spent: 29200, joined: '2024-05-22', status: 'active' },
  { name: 'Karim Hasan', email: 'karim.hasan@yahoo.com', phone: '01900-111222', orders: 3, spent: 6400, joined: '2024-08-01', status: 'active' },
  { name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com', phone: '01600-333444', orders: 21, spent: 96750, joined: '2023-12-10', status: 'active' },
  { name: 'Tanvir Alam', email: 'tanvir.alam@gmail.com', phone: '01711-555666', orders: 1, spent: 2340, joined: '2024-11-02', status: 'inactive' },
  { name: 'Amina Khatun', email: 'amina.khatun@gmail.com', phone: '01822-777888', orders: 6, spent: 18300, joined: '2024-02-18', status: 'active' },
];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = CUSTOMERS.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{CUSTOMERS.length} registered customers</p>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium text-right">Orders</th>
                <th className="px-4 py-3 font-medium text-right">Total Spent</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.email} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-xs">
                        {c.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy-800">{c.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {c.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-navy-800 text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-sm font-bold text-navy-800 text-right">
                    ৳{c.spent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{c.joined}</td>
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
          <div className="text-center py-12 text-gray-400 text-sm">No customers found</div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-400">Page 1 of 1</p>
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