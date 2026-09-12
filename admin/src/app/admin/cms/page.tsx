'use client';

import { useState } from 'react';
import {
  FileText, Image, HelpCircle, Shield, Plus,
  Edit2, Trash2, Eye, ToggleLeft, ToggleRight,
  ExternalLink, Globe,
} from 'lucide-react';

const PAGES = [
  { id: 1, title: 'About Us', slug: 'about', status: 'published', menu: true, template: 'default' },
  { id: 2, title: 'Contact', slug: 'contact', status: 'published', menu: true, template: 'sidebar' },
  { id: 3, title: 'Careers', slug: 'careers', status: 'draft', menu: false, template: 'full-width' },
];

const BANNERS = [
  { id: 1, title: 'Summer Sale 2025', position: 'hero', active: true, clicks: 1240, impressions: 45000 },
  { id: 2, title: 'Free Shipping Banner', position: 'sidebar', active: true, clicks: 890, impressions: 32000 },
  { id: 3, title: 'Eid Collection Popup', position: 'popup', active: false, clicks: 0, impressions: 0 },
];

const FAQS = [
  { id: 1, category: 'order', question: 'How do I track my order?', active: true },
  { id: 2, category: 'payment', question: 'What payment methods do you accept?', active: true },
  { id: 3, category: 'delivery', question: 'How long does delivery take?', active: true },
  { id: 4, category: 'return', question: 'What is your return policy?', active: true },
];

const POLICIES = [
  { type: 'terms', title: 'Terms of Service', version: '2.1', updated: '2025-01-01' },
  { type: 'privacy', title: 'Privacy Policy', version: '1.5', updated: '2025-01-01' },
  { type: 'return_policy', title: 'Return & Refund Policy', version: '1.2', updated: '2024-12-15' },
  { type: 'shipping_policy', title: 'Shipping Policy', version: '1.0', updated: '2024-11-01' },
];

type Tab = 'pages' | 'banners' | 'faq' | 'policies';

export default function AdminCmsPage() {
  const [tab, setTab] = useState<Tab>('pages');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">CMS Management</h1>
        <p className="text-gray-500 text-sm mt-1">Pages, banners, FAQ, and policies</p>
      </div>

      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-2">
        {[
          { key: 'pages', label: 'Pages', icon: FileText },
          { key: 'banners', label: 'Banners', icon: Image },
          { key: 'faq', label: 'FAQ', icon: HelpCircle },
          { key: 'policies', label: 'Policies', icon: Shield },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.key ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Pages */}
      {tab === 'pages' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-navy-900">All Pages</h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium"><Plus className="w-3.5 h-3.5" /> Add Page</button>
          </div>
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-4 py-3">Title</th><th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Template</th><th className="px-4 py-3">Menu</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {PAGES.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-navy-800">{p.title}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">/{p.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 capitalize">{p.template}</td>
                  <td className="px-4 py-3">{p.menu ? <ToggleRight className="w-7 h-4 text-green-500" /> : <ToggleLeft className="w-7 h-4 text-gray-300" />}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td>
                  <td className="px-4 py-3 flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600"><Edit2 className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><ExternalLink className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Banners */}
      {tab === 'banners' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BANNERS.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">{b.title}</div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-navy-800 text-sm">{b.title}</h4>
                  {b.active ? <ToggleRight className="w-7 h-4 text-green-500" /> : <ToggleLeft className="w-7 h-4 text-gray-300" />}
                </div>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">{b.position}</span>
                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                  <span>👁️ {b.impressions.toLocaleString()}</span>
                  <span>👆 {b.clicks.toLocaleString()}</span>
                  <span>CTR: {b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(1) : 0}%</span>
                </div>
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-[200px] hover:border-brand-300 transition">
            <Plus className="w-8 h-8 text-gray-300" />
          </button>
        </div>
      )}

      {/* FAQ */}
      {tab === 'faq' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-navy-900">FAQ Management</h3>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm font-medium"><Plus className="w-3.5 h-3.5" /> Add FAQ</button>
          </div>
          {FAQS.map((faq) => (
            <div key={faq.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-brand-100 text-brand-700 rounded text-xs capitalize font-medium">{faq.category}</span>
                <span className="text-sm text-navy-800">{faq.question}</span>
              </div>
              <div className="flex items-center gap-2">
                {faq.active ? <ToggleRight className="w-7 h-4 text-green-500" /> : <ToggleLeft className="w-7 h-4 text-gray-300" />}
                <button className="p-1 rounded hover:bg-brand-50 text-gray-400"><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Policies */}
      {tab === 'policies' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <th className="px-4 py-3">Policy</th><th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Version</th><th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {POLICIES.map((p) => (
                <tr key={p.type} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-navy-800 flex items-center gap-2"><Shield className="w-4 h-4 text-brand-600" />{p.title}</td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">{p.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">v{p.version}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{p.updated}</td>
                  <td className="px-4 py-3"><button className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600"><Edit2 className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}