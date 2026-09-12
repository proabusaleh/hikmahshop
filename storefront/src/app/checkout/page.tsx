'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import {
  MapPin, CreditCard, CheckCircle, ChevronRight,
  Truck, Shield, Smartphone, Banknote, Wallet, Loader2,
} from 'lucide-react';
import api from '@/lib/api';

type Step = 'address' | 'delivery' | 'payment' | 'review';

const PAYMENT_METHODS = [
  { id: 'cod',        label: 'Cash on Delivery',    icon: Banknote,    color: 'bg-gray-600',  desc: 'Pay when you receive' },
  { id: 'bkash',      label: 'bKash',               icon: Smartphone,  color: 'bg-pink-500',  desc: 'Mobile banking' },
  { id: 'nagad',      label: 'Nagad',               icon: Smartphone,  color: 'bg-orange-500', desc: 'Digital financial service' },
  { id: 'rocket',     label: 'Rocket',              icon: Smartphone,  color: 'bg-purple-500', desc: 'DBBL mobile banking' },
  { id: 'sslcommerz', label: 'Card / Net Banking',  icon: CreditCard,  color: 'bg-blue-600',  desc: 'Visa, Mastercard, Amex via SSLCOMMERZ' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, coupon, couponDiscount, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const [zones, setZones] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [address, setAddress] = useState({
    name: '', phone: '', email: '',
    address_line_1: '', address_line_2: '',
    city: '', district: '', division: '', zip_code: '',
  });
  const [zoneId, setZoneId] = useState<number | null>(null);
  const [payment, setPayment] = useState('bkash');
  const [couponCode, setCouponCode] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (items.length === 0) return;
    api.get('/checkout/summary').then(({ data }) => {
      setSummary(data.data);
      setZones(data.data.delivery_zones);
    }).catch(() => {});
  }, [items.length]);

  const selectedZone = zones.find((z) => z.id === zoneId);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = selectedZone?.shipping_charge ?? 0;
  const discount = (subtotal * couponDiscount) / 100;
  const total = subtotal + shipping - discount;

  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Address' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const { data } = await api.post('/checkout/place-order', {
        address,
        delivery_zone_id: zoneId,
        payment_method: payment,
        coupon_code: couponCode || undefined,
        customer_note: note || undefined,
      });

      clearCart();

      if (data.data.payment?.action === 'redirect') {
        const url = data.data.payment.gateway_url
          || data.data.payment.bkash_url
          || data.data.payment.nagad_url;
        if (url) {
          window.location.href = url;
          return;
        }
      }

      router.push(`/order/success?order=${data.data.order.order_number}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-navy-800">Your cart is empty</h2>
        <a href="/shop" className="text-brand-600 mt-4 inline-block hover:underline">Go to Shop</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-display text-navy-800 mb-8">Checkout</h1>

      <div className="flex items-center justify-center gap-1 mb-10 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-1">
            <button
              onClick={() => {
                const idx = steps.findIndex((x) => x.key === step);
                if (i <= idx) setStep(s.key);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                step === s.key
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                  : i < steps.findIndex((x) => x.key === step)
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                {i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 'address' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-600" /> Shipping Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name *', type: 'text', placeholder: 'Your name' },
                  { key: 'phone', label: 'Phone *', type: 'tel', placeholder: '01XXXXXXXXX' },
                  { key: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
                  { key: 'division', label: 'Division *', type: 'text', placeholder: 'Dhaka' },
                  { key: 'district', label: 'District *', type: 'text', placeholder: 'Dhaka' },
                  { key: 'city', label: 'City/Area *', type: 'text', placeholder: 'Dhanmondi' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      value={(address as any)[field.key]}
                      onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder={field.placeholder}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
                <textarea
                  value={address.address_line_1}
                  onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="House, Road, Area..."
                />
              </div>
              <button
                onClick={() => setStep('delivery')}
                disabled={!address.name || !address.phone || !address.division || !address.address_line_1}
                className="w-full py-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-40"
              >
                Continue to Delivery →
              </button>
            </div>
          )}

          {step === 'delivery' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-600" /> Delivery Method
              </h2>
              <div className="space-y-3">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setZoneId(zone.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition text-left ${
                      zoneId === zone.id
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-brand-600" />
                        <span className="font-semibold text-navy-800">{zone.name}</span>
                        {zone.free_shipping && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated: {zone.estimated}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-navy-800">
                      {zone.shipping_charge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `৳${zone.shipping_charge}`
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('address')}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!zoneId}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition disabled:opacity-40"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600" /> Payment Method
              </h2>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPayment(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
                      payment === method.id
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-navy-800">{method.label}</p>
                      <p className="text-xs text-gray-500">{method.desc}</p>
                    </div>
                    {payment === method.id && (
                      <CheckCircle className="w-5 h-5 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>

              {payment === 'sslcommerz' && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Secure Payment via SSLCOMMERZ
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        You'll be redirected to SSLCOMMERZ's secure payment gateway.
                        Supports Visa, Mastercard, Amex, bKash, Nagad, Rocket,
                        and all major Bangladeshi bank internet banking.
                      </p>
                      <div className="flex gap-2 mt-2">
                        {['VISA', 'MC', 'bKash', 'Nagad', 'IB'].map((m) => (
                          <span key={m} className="px-2 py-0.5 bg-white rounded text-[10px] font-bold text-blue-700 border border-blue-200">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {payment === 'bkash' && (
                <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                  <p className="text-sm text-pink-700">
                    📱 You'll be redirected to bKash payment page.
                    Enter your bKash number and confirm with PIN.
                  </p>
                </div>
              )}

              {payment === 'cod' && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600">
                    💵 Pay with cash when your order is delivered.
                    Please keep exact change ready. An additional ৳20 COD charge may apply.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('delivery')}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('review')}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
                >
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-bold text-navy-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-600" /> Review Your Order
              </h2>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Shipping To</p>
                    <p className="font-semibold text-navy-800">{address.name}</p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                    <p className="text-sm text-gray-500">
                      {address.address_line_1}, {address.city}, {address.district}, {address.division}
                    </p>
                  </div>
                  <button onClick={() => setStep('address')} className="text-sm text-brand-600 hover:underline">
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-600" />
                  <span className="font-medium text-navy-800">
                    {selectedZone?.name || 'Standard Delivery'}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({selectedZone?.estimated})
                  </span>
                </div>
                <button onClick={() => setStep('delivery')} className="text-sm text-brand-600 hover:underline">
                  Change
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-navy-800">
                    {PAYMENT_METHODS.find((m) => m.id === payment)?.label}
                  </span>
                </div>
                <button onClick={() => setStep('payment')} className="text-sm text-brand-600 hover:underline">
                  Change
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-3">
                  Items ({items.length})
                </p>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-gray-400">Img</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-navy-800">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (optional)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button className="px-4 py-2.5 bg-navy-800 text-white rounded-xl text-sm font-medium hover:bg-navy-900 transition">
                  Apply
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  placeholder="Special delivery instructions..."
                />
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping ({selectedZone?.name})</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : `৳${shipping}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between text-xl font-bold text-navy-800 pt-2">
                  <span>Total</span>
                  <span>৳{Math.round(total).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-brand-200"
                >
                  {placing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Place Order — ৳{Math.round(total).toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-navy-800 mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                  <span className="flex-1 text-gray-600 truncate">{item.name}</span>
                  <span className="font-medium text-navy-800">×{item.quantity}</span>
                </div>
              ))}
            </div>
            <hr className="mb-3" />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg text-navy-800">
              <span>Total</span>
              <span>৳{Math.round(total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
