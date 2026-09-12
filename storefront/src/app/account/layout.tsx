'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, ShoppingBag, Heart, MapPin, CreditCard,
  Star, Tag, Bell, Shield, LogOut, ChevronRight,
} from 'lucide-react';

const menuItems = [
  { href: '/account', label: 'Dashboard', icon: User },
  { href: '/account/orders', label: 'My Orders', icon: ShoppingBag, badge: 2 },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/payments', label: 'Payments', icon: CreditCard },
  { href: '/account/reviews', label: 'My Reviews', icon: Star },
  { href: '/account/coupons', label: 'My Coupons', icon: Tag },
  { href: '/account/notifications', label: 'Notifications', icon: Bell, badge: 5 },
  { href: '/account/security', label: 'Security', icon: Shield },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <a href="/" className="hover:text-brand-600">Home</a>
        <span className="mx-2">/</span>
        <span className="text-navy-800 font-medium">My Account</span>
      </nav>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-center">
            <div className="w-16 h-16 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
              RU
            </div>
            <h3 className="font-bold text-navy-800">Rahim Uddin</h3>
            <p className="text-sm text-gray-400">rahim@email.com</p>
            <p className="text-xs text-gray-400 mt-1">Member since Jan 2024</p>
          </div>

          {/* Menu */}
          <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {menuItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/account' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition border-b border-gray-50 last:border-0 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border-l-4 border-l-brand-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                </Link>
              );
            })}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}