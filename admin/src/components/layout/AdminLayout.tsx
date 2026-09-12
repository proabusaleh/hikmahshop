'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  CreditCard,
  Tag,
  Truck,
  Star,
  FileText,
  Globe,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', active: true },
  { icon: ShoppingCart, label: 'Orders', href: '/orders', active: false },
  { icon: Package, label: 'Products', href: '/products', active: false },
  { icon: Users, label: 'Customers', href: '/customers', active: false },
  { icon: CreditCard, label: 'Payments', href: '/payments', active: false },
  { icon: Tag, label: 'Coupons', href: '/coupons', active: false },
  { icon: Star, label: 'Reviews', href: '/admin/reviews', active: false },
  { icon: FileText, label: 'Blog', href: '/admin/blog', active: false },
  { icon: Globe, label: 'CMS', href: '/admin/cms', active: false },
  { icon: Package, label: 'Campaigns', href: '/campaigns', active: false },
  { icon: Truck, label: 'Delivery', href: '/delivery', active: false },
  { icon: Package, label: 'Inventory', href: '/admin/inventory', active: false },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics', active: false },
  { icon: Settings, label: 'Settings', href: '/settings', active: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-navy-900 text-gray-300 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="font-bold text-white font-display">
                Hikmah<span className="text-brand-400">Admin</span>
              </span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                item.active
                  ? 'bg-brand-600 text-white'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              A
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">admin@hikmahshop.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders, products, customers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
