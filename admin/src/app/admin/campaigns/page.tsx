'use client';

import { useState } from 'react';
import { Plus, Megaphone, Clock, Eye, MousePointerClick } from 'lucide-react';

const CAMPAIGNS = [
  { name: 'Winter Sale 2025', type: 'flash_sale', channel: 'Homepage Banner', status: 'active', starts: '2025-01-15', ends: '2025-01-31', views: 48210, clicks: 5830 },
  { name: 'Eid Mega Offer', type: 'discount', channel: 'Push + Email', status: 'scheduled', starts: '2025-06-01', ends: '2025-07-10', views: 0, clicks: 0 },
  { name: 'New Customer Welcome', type: 'coupon', channel: 'Email', status: 'active', starts: '2025-01-01', ends: '2025-12-31', views: 12034, clicks: 1820 },
  { name: 'Bundle & Save', type: 'bundling', channel: 'Product Pages', status: 'paused', starts: '2024-11-10', ends: '2025-01-31', views: 28310, clicks: 2540 },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  paused: 'bg-yellow-100 text-yellow-700',
  ended: 'bg-gray-100 text-gray-600',
};

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = CAMPAIGNS.filter((c) => filter === 'all' || c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">Promotions, flash sales and marketing pushes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'scheduled', 'paused'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              filter === s
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900">{c.name}</h3>
                  <p className="text-xs text-gray-400 capitalize">{c.type} • {c.channel}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[c.status]}`}>
                {c.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {c.starts} → {c.ends}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Impressions
                </p>
                <p className="text-lg font-bold text-navy-900 mt-1">{c.views.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <MousePointerClick className="w-3 h-3" /> Clicks
                </p>
                <p className="text-lg font-bold text-navy-900 mt-1">{c.clicks.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No campaigns found</div>
      )}
    </div>
  );
}