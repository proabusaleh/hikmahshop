'use client';

import {
  ShoppingBag, Heart, Package, MapPin,
  Star, Tag, ArrowRight, Clock, Truck,
  CheckCircle, AlertCircle, Bell, Shield,
} from 'lucide-react';
import Link from 'next/link';

const quickStats = [
  { label: 'Active Orders', value: 3, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600', href: '/account/orders' },
  { label: 'Wishlist Items', value: 12, icon: Heart, color: 'bg-pink-100 text-pink-600', href: '/account/wishlist' },
  { label: 'Total Reviews', value: 8, icon: Star, color: 'bg-yellow-100 text-yellow-600', href: '/account/reviews' },
  { label: 'Saved Addresses', value: 2, icon: MapPin, color: 'bg-green-100 text-green-600', href: '/account/addresses' },
];

const recentOrders = [
  { id: 'HS-20250115-A1B2C3', status: 'shipped', items: 3, total: 3385, date: 'Jan 15, 2025', eta: 'Jan 17' },
  { id: 'HS-20250112-D4E5F6', status: 'delivered', items: 1, total: 1299, date: 'Jan 12, 2025', eta: null },
  { id: 'HS-20250108-G7H8I9', status: 'processing', items: 5, total: 8950, date: 'Jan 8, 2025', eta: 'Jan 18' },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  pending:    { icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-100' },
  processing: { icon: Package,     color: 'text-indigo-600', bg: 'bg-indigo-100' },
  shipped:    { icon: Truck,       color: 'text-cyan-600',   bg: 'bg-cyan-100' },
  delivered:  { icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-100' },
  cancelled:  { icon: AlertCircle, color: 'text-red-600',    bg: 'bg-red-100' },
};

export default function AccountDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Welcome back, Rahim! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your account</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition group"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="text-sm text-brand-600 font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => {
            const config = statusConfig[order.status];
            const Icon = config.icon;
            return (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-semibold text-navy-800">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.date} • {order.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-navy-800">৳{order.total.toLocaleString()}</p>
                  <p className={`text-xs font-medium capitalize ${config.color}`}>
                    {order.status}
                    {order.eta && ` • ETA ${order.eta}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/account/coupons"
          className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-5 hover:shadow-lg transition"
        >
          <Tag className="w-6 h-6 mb-2" />
          <h3 className="font-bold">My Coupons</h3>
          <p className="text-sm text-brand-100 mt-1">3 active coupons available</p>
        </Link>
        <Link
          href="/account/notifications"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-5 hover:shadow-lg transition"
        >
          <Bell className="w-6 h-6 mb-2" />
          <h3 className="font-bold">Notifications</h3>
          <p className="text-sm text-blue-100 mt-1">5 unread notifications</p>
        </Link>
        <Link
          href="/account/security"
          className="bg-gradient-to-r from-navy-800 to-navy-900 text-white rounded-2xl p-5 hover:shadow-lg transition"
        >
          <Shield className="w-6 h-6 mb-2" />
          <h3 className="font-bold">Security</h3>
          <p className="text-sm text-gray-300 mt-1">Manage password & 2FA</p>
        </Link>
      </div>
    </div>
  );
}