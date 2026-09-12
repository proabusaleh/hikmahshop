'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import SearchOverlay from '@/components/search/SearchOverlay';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  {
    href: '/categories',
    label: 'Categories',
    children: ['Electronics', 'Fashion', 'Home & Living', 'Health', 'Grocery'],
  },
  { href: '/deals', label: 'Deals', badge: 'Hot' },
  { href: '/new-arrivals', label: 'New Arrivals' },
  { href: '/best-sellers', label: 'Best Sellers' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* ── Top Bar ── */}
      <div className="bg-navy-800 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>🚚 Free delivery on orders over ৳999</span>
          <span>📞 Support: +880 1XXX-XXXXXX</span>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">H</span>
            </div>
            <span className="text-xl font-bold font-display text-navy-800">
              Hikmah<span className="text-brand-600">Shop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-medium text-navy-700 hover:text-brand-600 transition-colors rounded-lg hover:bg-brand-50 group"
              >
                {link.label}
                {link.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
                {link.children && (
                  <ChevronDown className="inline w-3 h-3 ml-0.5" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Search className="w-5 h-5 text-navy-700" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
            >
              <Heart className="w-5 h-5 text-navy-700" />
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full hover:bg-gray-100 transition relative"
            >
              <ShoppingCart className="w-5 h-5 text-navy-700" />
              <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                5
              </span>
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition"
            >
              <User className="w-4 h-4" />
              Account
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Overlay ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 top-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold font-display">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 rounded-lg text-navy-700 hover:bg-brand-50 hover:text-brand-600 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/account"
                className="mt-6 block w-full text-center py-3 bg-brand-600 text-white rounded-xl font-medium"
              >
                My Account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
