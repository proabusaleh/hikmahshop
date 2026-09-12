'use client';

import { useState } from 'react';
import {
  Bell, Package, Truck, Tag, Star,
  CheckCircle, CheckCheck, Settings, Clock,
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1, type: 'order', icon: Truck, color: 'bg-cyan-100 text-cyan-600',
    title: 'Order Shipped!',
    body: 'Your order HS-20250115-A1B2C3 has been shipped via Steadfast. Tracking: ST-12345678',
    time: '2 hours ago', read: false,
  },
  {
    id: 2, type: 'promo', icon: Tag, color: 'bg-brand-100 text-brand-600',
    title: 'Flash Sale Starting Tonight!',
    body: 'Up to 60% off on Electronics. Don\'t miss out — starts at 8 PM!',
    time: '5 hours ago', read: false,
  },
  {
    id: 3, type: 'price_drop', icon: Tag, color: 'bg-green-100 text-green-600',
    title: 'Price Drop Alert!',
    body: 'Wireless Earbuds Pro is now ৳999 (was ৳1,299). 23% off!',
    time: '1 day ago', read: false,
  },
  {
    id: 4, type: 'delivery', icon: CheckCircle, color: 'bg-green-100 text-green-600',
    title: 'Order Delivered',
    body: 'Your order HS-20250112-D4E5F6 has been delivered. How was your experience?',
    time: '3 days ago', read: true,
  },
  {
    id: 5, type: 'review', icon: Star, color: 'bg-yellow-100 text-yellow-600',
    title: 'Rate Your Purchase',
    body: 'You received Running Shoes X1. Share your review and help other shoppers!',
    time: '3 days ago', read: true,
  },
  {
    id: 6, type: 'stock', icon: Package, color: 'bg-purple-100 text-purple-600',
    title: 'Back in Stock!',
    body: 'Smart Watch Ultra is back in stock. Grab it before it sells out again!',
    time: '5 days ago', read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 px-3 py-2 text-sm text-brand-600 hover:bg-brand-50 rounded-xl transition"
            >
              <CheckCheck className="w-4 h-4" /> Mark All Read
            </button>
          )}
          <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'order', label: 'Orders' },
          { key: 'promo', label: 'Promos' },
          { key: 'price_drop', label: 'Price Drops' },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === f.key
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((notif) => {
          const Icon = notif.icon;
          return (
            <button
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left transition ${
                notif.read
                  ? 'bg-white border-gray-100 hover:bg-gray-50'
                  : 'bg-brand-50/50 border-brand-200 hover:bg-brand-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${notif.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${notif.read ? 'text-navy-800' : 'font-bold text-navy-900'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-brand-600 rounded-full flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {notif.time}
                </p>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
