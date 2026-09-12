import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    desc: 'On orders over ৳999 across Bangladesh',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure Payment',
    desc: 'bKash, Nagad, Cards & SSLCOMMERZ protected',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: '7-day hassle-free return policy',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Dedicated customer service team',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function WhyHikmahShop() {
  return (
    <section className="py-16 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold font-display text-white mb-12">
          Why Choose <span className="text-brand-400">HikmahShop</span>?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-brand-400/30 transition-all group"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
