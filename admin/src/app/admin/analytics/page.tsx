'use client';

import { useState } from 'react';
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  BarChart3, PieChart, Activity, ArrowUpRight,
  Calendar, Download,
} from 'lucide-react';

const monthlyRevenue = [
  { month: 'Jan', revenue: 850000 }, { month: 'Feb', revenue: 920000 },
  { month: 'Mar', revenue: 1100000 }, { month: 'Apr', revenue: 980000 },
  { month: 'May', revenue: 1250000 }, { month: 'Jun', revenue: 1180000 },
  { month: 'Jul', revenue: 1350000 }, { month: 'Aug', revenue: 1420000 },
  { month: 'Sep', revenue: 1280000 }, { month: 'Oct', revenue: 1550000 },
  { month: 'Nov', revenue: 1890000 }, { month: 'Dec', revenue: 2100000 },
];

const customerGrowth = [
  { month: 'Jan', new: 120, returning: 340 },
  { month: 'Feb', new: 145, returning: 380 },
  { month: 'Mar', new: 180, returning: 420 },
  { month: 'Apr', new: 160, returning: 450 },
  { month: 'May', new: 210, returning: 490 },
  { month: 'Jun', new: 195, returning: 520 },
];

const topCategories = [
  { name: 'Electronics', revenue: 4500000, orders: 1200, products: 450, color: '#3b82f6' },
  { name: 'Fashion', revenue: 3200000, orders: 2800, products: 890, color: '#ec4899' },
  { name: 'Home & Living', revenue: 1800000, orders: 650, products: 320, color: '#f59e0b' },
  { name: 'Health & Beauty', revenue: 1200000, orders: 980, products: 210, color: '#10b981' },
  { name: 'Grocery', revenue: 800000, orders: 1500, products: 150, color: '#8b5cf6' },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d');
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Analytics &amp; Reports</h1>
          <p className="text-gray-500 text-sm mt-1">Deep dive into your store performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '৳15,87,000', change: '+18.2%', icon: DollarSign, color: 'text-green-600 bg-green-100' },
          { label: 'Total Orders', value: '3,842', change: '+12.5%', icon: ShoppingCart, color: 'text-blue-600 bg-blue-100' },
          { label: 'Avg Order Value', value: '৳4,131', change: '+5.1%', icon: Activity, color: 'text-purple-600 bg-purple-100' },
          { label: 'Conversion Rate', value: '3.24%', change: '+0.8%', icon: TrendingUp, color: 'text-orange-600 bg-orange-100' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${kpi.color} flex items-center justify-center`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">{kpi.label}</span>
            </div>
            <p className="text-xl font-bold text-navy-900">{kpi.value}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{kpi.change} vs prev period</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-navy-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-600" /> Monthly Revenue
        </h2>
        <div className="flex items-end gap-2 h-56">
          {monthlyRevenue.map((m) => {
            const height = (m.revenue / maxRevenue) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition">
                  ৳{(m.revenue / 100000).toFixed(1)}L
                </span>
                <div
                  className="w-full bg-brand-600 rounded-t-lg hover:bg-brand-500 transition-all cursor-pointer"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600" /> Customer Growth
          </h2>
          <div className="space-y-3">
            {customerGrowth.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-8">{m.month}</span>
                <div className="flex-1 flex gap-1 h-6">
                  <div
                    className="bg-brand-600 rounded-l-md"
                    style={{ width: `${(m.new / (m.new + m.returning)) * 100}%` }}
                    title={`New: ${m.new}`}
                  />
                  <div
                    className="bg-brand-200 rounded-r-md"
                    style={{ width: `${(m.returning / (m.new + m.returning)) * 100}%` }}
                    title={`Returning: ${m.returning}`}
                  />
                </div>
                <span className="text-xs text-gray-400 w-16 text-right">
                  +{m.new} / {m.returning}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-600 rounded" /> New</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-brand-200 rounded" /> Returning</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-brand-600" /> Top Categories
          </h2>
          <div className="space-y-4">
            {topCategories.map((cat) => {
              const maxCatRevenue = topCategories[0].revenue;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-navy-800">{cat.name}</span>
                    <span className="text-sm font-bold text-navy-800">
                      ৳{(cat.revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${(cat.revenue / maxCatRevenue) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat.orders} orders &bull; {cat.products} products
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}