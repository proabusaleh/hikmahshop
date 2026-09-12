'use client';

import { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    category: 'Order',
    items: [
      { q: 'How do I place an order?', a: 'Browse products, add to cart, proceed to checkout, enter your address and payment details, then confirm your order.' },
      { q: 'Can I modify my order after placing it?', a: 'You can modify your order within 1 hour of placing it. Go to My Orders → Order Details → Modify. After that, contact support.' },
      { q: 'How do I cancel my order?', a: 'Go to My Orders, select the order, and click Cancel. Orders can only be cancelled before they are shipped.' },
    ],
  },
  {
    category: 'Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept bKash, Nagad, Rocket, Visa/Mastercard (via SSLCOMMERZ), Internet Banking, and Cash on Delivery (COD).' },
      { q: 'Is my payment information secure?', a: 'Yes! All payments are processed through SSLCOMMERZ, Bangladesh\'s leading payment gateway with 256-bit SSL encryption.' },
      { q: 'When will I be charged?', a: 'For online payments, you\'re charged immediately. For COD, you pay when the order is delivered.' },
    ],
  },
  {
    category: 'Delivery',
    items: [
      { q: 'How long does delivery take?', a: 'Inside Dhaka: 1-2 days. Outside Dhaka: 3-5 days. Remote areas: 5-7 days.' },
      { q: 'Is there free shipping?', a: 'Yes! Orders over ৳999 get free delivery inside Dhaka. Orders over ৳1,999 get free delivery nationwide.' },
      { q: 'How do I track my order?', a: 'Go to My Orders → select your order → you\'ll see real-time tracking with courier details and estimated delivery date.' },
    ],
  },
  {
    category: 'Returns',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 7-day easy return policy. Products must be unused and in original packaging.' },
      { q: 'How do I initiate a return?', a: 'Go to My Orders → select the order → click Return → choose reason → submit. Our team will arrange pickup within 24 hours.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 3-5 business days after we receive the returned product.' },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const toggle = (key: string) => {
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <HelpCircle className="w-12 h-12 text-brand-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold font-display text-navy-900">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 mt-2">Find quick answers to common questions</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQ..."
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="space-y-8">
        {FAQ_DATA.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-600 rounded-full" />
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items
                .filter((item) =>
                  !search || item.q.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openItem === key;
                  return (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
                      >
                        <span className="text-sm font-semibold text-navy-800 pr-4">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 bg-brand-50 rounded-2xl">
        <h3 className="text-lg font-bold text-navy-900 mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Our support team is ready to help you 24/7
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/contact"
            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            Contact Support
          </a>
          <a
            href="tel:+8801XXXXXXXXX"
            className="px-6 py-2.5 border border-brand-600 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-50 transition"
          >
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}