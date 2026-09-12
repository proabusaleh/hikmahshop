import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Deals', href: '/shop?flash_sale=1' },
      { label: 'New Arrivals', href: '/shop?new_arrival=1' },
      { label: 'Best Sellers', href: '/shop?best_seller=1' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping Info', href: '/shipping-policy' },
      { label: 'Returns', href: '/return-policy' },
      { label: 'Track Order', href: '/account/orders' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'About HikmahShop', href: '/about' },
      { label: 'Careers', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-white font-display">
                Hikmah<span className="text-brand-400">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Shop Smart. Live Better. Your trusted online shopping destination
              in Bangladesh with premium products and fast delivery.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" /> +880 1XXX-XXXXXX
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" /> support@hikmahshop.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" /> Dhaka, Bangladesh
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-600 transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-400 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2025 HikmahShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Payment Methods:</span>
            {['bKash', 'Nagad', 'Rocket', 'VISA', 'Mastercard'].map((m) => (
              <span
                key={m}
                className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
