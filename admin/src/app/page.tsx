'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import {
  DollarSign, ShoppingCart, Users, Package,
  TrendingUp, TrendingDown, ArrowUpRight,
  Clock, AlertTriangle, XCircle,
  BarChart3, PieChart, Activity,
} from 'lucide-react';

function MiniChart({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all hover:opacity-80"
          style={{
            height: `${((val - min) / range) * 100}%`,
            backgroundColor: color,
            minHeight: 4,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const percent = (seg.value / total) * 100;
            const offset = cumulative;
            cumulative += percent;
            return (
              <circle
                key={i}
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke={seg.color}
                strokeWidth="3"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={`${-offset}`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-navy-900">{total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-gray-600">{seg.label}</span>
            <span className="font-semibold text-navy-800 ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fallbackStats = [
  { label: "Today's Sales", value: '৳1,24,589', change: '+12.5%', up: true, icon: DollarSign, color: 'bg-green-100 text-green-600', chart: [30, 45, 35, 50, 49, 60, 70, 65, 80, 75, 90, 95] },
  { label: "Today's Orders", value: '84', change: '+8.2%', up: true, icon: ShoppingCart, color: 'bg-blue-100 text-blue-600', chart: [12, 19, 15, 22, 18, 25, 30, 28, 35, 32, 38, 42] },
  { label: 'Total Customers', value: '5,672', change: '+15.3%', up: true, icon: Users, color: 'bg-purple-100 text-purple-600', chart: [100, 120, 115, 140, 135, 160, 155, 180, 175, 200, 210, 230] },
  { label: 'Total Products', value: '2,341', change: '-2.1%', up: false, icon: Package, color: 'bg-orange-100 text-orange-600', chart: [50, 52, 51, 53, 55, 54, 56, 55, 57, 56, 58, 57] },
];

const alerts = [
  { label: 'Pending Orders', count: 24, icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { label: 'Low Stock Items', count: 18, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { label: 'Out of Stock', count: 5, icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
];

const dailySales = [
  { day: 'Mon', sales: 45000, orders: 32 },
  { day: 'Tue', sales: 52000, orders: 38 },
  { day: 'Wed', sales: 48000, orders: 35 },
  { day: 'Thu', sales: 61000, orders: 45 },
  { day: 'Fri', sales: 72000, orders: 52 },
  { day: 'Sat', sales: 85000, orders: 61 },
  { day: 'Sun', sales: 68000, orders: 48 },
];

const topProducts = [
  { name: 'Wireless Earbuds Pro', sold: 340, revenue: 441660, trend: '+15%' },
  { name: 'Smart Watch Ultra', sold: 280, revenue: 979720, trend: '+22%' },
  { name: 'Cotton T-Shirt', sold: 520, revenue: 311480, trend: '+8%' },
  { name: 'Running Shoes X1', sold: 190, revenue: 360810, trend: '-3%' },
  { name: 'Phone Case Premium', sold: 680, revenue: 339320, trend: '+12%' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(fallbackStats);
  const [alertCounts, setAlertCounts] = useState({
    pending_orders: 24,
    low_stock: 18,
    out_of_stock: 5,
  });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    let cancelled = false;

    async function loadDashboard() {
      try {
        const res = await fetch(`${apiUrl}/admin/analytics/dashboard`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) return;
        const json = await res.json();
        if (!json.success || cancelled) return;

        const d = json.data;
        const sales = parseFloat(d.today?.sales ?? 0).toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        const salesChange = d.today?.sales_change ?? 0;
        const ordersChange = d.today?.orders_change ?? 0;

        setStats([
          {
            ...fallbackStats[0],
            value: `৳${Number(sales).toLocaleString('en-IN')}`,
            change: `${salesChange >= 0 ? '+' : ''}${salesChange}%`,
            up: salesChange >= 0,
          },
          {
            ...fallbackStats[1],
            value: String(d.today?.orders ?? 0),
            change: `${ordersChange >= 0 ? '+' : ''}${ordersChange}%`,
            up: ordersChange >= 0,
          },
          {
            ...fallbackStats[2],
            value: Number(d.totals?.customers ?? 0).toLocaleString('en-IN'),
            change: '+15.3%',
            up: true,
          },
          {
            ...fallbackStats[3],
            value: Number(d.totals?.products ?? 0).toLocaleString('en-IN'),
            change: '-2.1%',
            up: false,
          },
        ]);

        setAlertCounts({
          pending_orders: d.alerts?.pending_orders ?? 24,
          low_stock: d.alerts?.low_stock ?? 18,
          out_of_stock: d.alerts?.out_of_stock ?? 5,
        });
      } catch {
        // keep fallback data
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const alertList = [
    { ...alerts[0], count: alertCounts.pending_orders },
    { ...alerts[1], count: alertCounts.low_stock },
    { ...alerts[2], count: alertCounts.out_of_stock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <div className="flex gap-2">
          {['Today', '7D', '30D', '90D'].map((p, i) => (
            <button
              key={p}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                i === 0 ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-navy-900 mt-1">{stat.value}</p>
            <div className="mt-3">
              <MiniChart data={stat.chart} color={stat.up ? '#10b981' : '#ef4444'} height={40} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {alertList.map((alert) => (
          <a
            key={alert.label}
            href={alert.label.includes('Pending') ? '/admin/orders?status=pending' : '/admin/inventory?low_stock=true'}
            className={`flex items-center gap-3 p-4 rounded-xl border ${alert.color} hover:shadow-md transition`}
          >
            <alert.icon className="w-6 h-6" />
            <div>
              <p className="text-2xl font-bold">{alert.count}</p>
              <p className="text-sm font-medium">{alert.label}</p>
            </div>
            <ArrowUpRight className="w-4 h-4 ml-auto opacity-50" />
          </a>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-navy-900">Weekly Sales</h2>
              <p className="text-sm text-gray-500">Revenue &amp; orders this week</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-brand-600" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-400" /> Orders
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-48">
            {dailySales.map((d) => {
              const maxSales = Math.max(...dailySales.map((x) => x.sales));
              const height = (d.sales / maxSales) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-navy-800">
                    ৳{(d.sales / 1000).toFixed(0)}K
                  </span>
                  <div className="w-full relative" style={{ height: `${height}%` }}>
                    <div className="absolute inset-0 bg-brand-600 rounded-t-lg opacity-80 hover:opacity-100 transition" />
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-navy-900 mb-4">Order Status</h2>
          <DonutChart
            segments={[
              { label: 'Delivered', value: 890, color: '#10b981' },
              { label: 'Shipped', value: 45, color: '#06b6d4' },
              { label: 'Processing', value: 32, color: '#6366f1' },
              { label: 'Pending', value: 24, color: '#f59e0b' },
              { label: 'Cancelled', value: 12, color: '#ef4444' },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900">Top Products</h2>
          <a href="/admin/analytics" className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1">
            View Analytics <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
              <th className="pb-3 font-medium">#</th>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium text-right">Sold</th>
              <th className="pb-3 font-medium text-right">Revenue</th>
              <th className="pb-3 font-medium text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topProducts.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50 transition">
                <td className="py-3 text-sm text-gray-400 font-medium">{i + 1}</td>
                <td className="py-3 text-sm font-medium text-navy-800">{p.name}</td>
                <td className="py-3 text-sm text-right font-semibold">{p.sold}</td>
                <td className="py-3 text-sm text-right font-bold text-navy-800">
                  ৳{(p.revenue / 1000).toFixed(0)}K
                </td>
                <td className="py-3 text-right">
                  <span className={`text-sm font-medium ${p.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {p.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}