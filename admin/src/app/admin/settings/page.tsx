'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: 'HikmahShop',
    email: 'support@hikmahshop.com',
    phone: '+880 1XXX-XXXXXX',
    address: 'Dhaka, Bangladesh',
    currency: 'BDT (৳)',
    supportHours: '9:00 AM – 9:00 PM',
    cod: true,
    onlinePayment: true,
    autoApproveReviews: false,
  });
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setStore((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls =
    'w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Store configuration and preferences</p>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
        >
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-navy-900">Store Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
            <input className={inputCls} value={store.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Email</label>
            <input className={inputCls} value={store.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input className={inputCls} value={store.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select className={inputCls} value={store.currency} onChange={(e) => update('currency', e.target.value)}>
              <option>BDT (৳)</option>
              <option>USD ($)</option>
              <option>INR (₹)</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input className={inputCls} value={store.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Support Hours</label>
            <input className={inputCls} value={store.supportHours} onChange={(e) => update('supportHours', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-navy-900">Order & Payment</h2>

        {[
          { key: 'cod' as const, label: 'Cash on Delivery', desc: 'Allow customers to pay in cash on delivery' },
          { key: 'onlinePayment' as const, label: 'Online Payment', desc: 'Accept bKash, Nagad, sslcommerz and card payments' },
          { key: 'autoApproveReviews' as const, label: 'Auto-Approve Reviews', desc: 'Publish customer reviews without moderation' },
        ].map((opt) => (
          <label key={opt.key} className="flex items-start justify-between gap-4 py-2">
            <div>
              <p className="text-sm font-medium text-navy-800">{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => update(opt.key, !store[opt.key])}
              className={`relative w-11 h-6 rounded-full transition ${store[opt.key] ? 'bg-brand-600' : 'bg-gray-200'}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  store[opt.key] ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          </label>
        ))}
      </div>
    </div>
  );
}