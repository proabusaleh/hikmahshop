'use client';

import { useState } from 'react';
import { Search, Truck, ChevronLeft, ChevronRight, Package, Cpu } from 'lucide-react';

const DELIVERIES = [
  { id: 'DL-20250115-01', order: 'HS-20250115-7F9K2M', zone: 'Dhaka (In-City)', courier: 'Internal Rider', weight: '0.8 kg', status: 'on_the_way', eta: 'Today, 8:00 PM' },
  { id: 'DL-20250115-02', order: 'HS-20250115-2X8L4N', zone: 'Chattogram', courier: 'Steadfast', weight: '1.2 kg', status: 'out_for_delivery', eta: 'Tomorrow, 5:00 PM' },
  { id: 'DL-20250114-03', order: 'HS-20250114-8B6C1D', zone: 'Dhaka (Suburban)', courier: 'Pathao', weight: '3.4 kg', status: 'pending', eta: 'Jan 16' },
  { id: 'DL-20250114-04', order: 'HS-20250114-6A4R8E', zone: 'Khulna', courier: 'RedX', weight: '1.0 kg', status: 'delivered', eta: 'Delivered Jan 14' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processed: 'bg-blue-100 text-blue-700',
  on_the_way: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminDeliveryPage() {
  const [search, setSearch] = useState('');

  const filtered = DELIVERIES.filter(
    (d) =>
      !search ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.order.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Delivery Management</h1>
        <p className="text-gray-500 text-sm mt-1">Assign couriers and track shipments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">14</p>
            <p className="text-sm text-gray-500">Pending Pickups</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">32</p>
            <p className="text-sm text-gray-500">In Transit</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy-900">248</p>
            <p className="text-sm text-gray-500">Delivered Today</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search delivery or order ID..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Delivery</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Zone</th>
                <th className="px-4 py-3 font-medium">Courier</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-semibold text-navy-800">{d.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.order}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.zone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{d.courier}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[d.status]}`}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{d.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No deliveries found</div>
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