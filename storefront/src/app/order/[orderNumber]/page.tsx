'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Package, Truck, CheckCircle, Clock, XCircle,
  MapPin, Phone, Mail, ChevronDown, ChevronUp,
  RotateCcw, ArrowLeft,
} from 'lucide-react';
import api from '@/lib/api';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  pending:          { label: 'Pending',          color: 'text-yellow-600', icon: Clock,       bg: 'bg-yellow-100' },
  confirmed:        { label: 'Confirmed',        color: 'text-blue-600',   icon: CheckCircle, bg: 'bg-blue-100' },
  processing:       { label: 'Processing',       color: 'text-indigo-600', icon: Package,     bg: 'bg-indigo-100' },
  packed:           { label: 'Packed',           color: 'text-purple-600', icon: Package,     bg: 'bg-purple-100' },
  shipped:          { label: 'Shipped',          color: 'text-cyan-600',   icon: Truck,       bg: 'bg-cyan-100' },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-orange-600', icon: Truck,       bg: 'bg-orange-100' },
  delivered:        { label: 'Delivered',        color: 'text-green-600',  icon: CheckCircle, bg: 'bg-green-100' },
  cancelled:        { label: 'Cancelled',        color: 'text-red-600',    icon: XCircle,     bg: 'bg-red-100' },
  returned:         { label: 'Returned',         color: 'text-gray-600',   icon: RotateCcw,   bg: 'bg-gray-100' },
  refunded:         { label: 'Refunded',         color: 'text-gray-600',   icon: RotateCcw,   bg: 'bg-gray-100' },
};

const STATUS_FLOW = [
  'pending', 'confirmed', 'processing', 'packed',
  'shipped', 'out_for_delivery', 'delivered',
];

export default function OrderTrackingPage() {
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showItems, setShowItems] = useState(true);

  useEffect(() => {
    api.get(`/orders/${params.orderNumber}`)
      .then(({ data }) => setOrder(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-navy-800">Order not found</h2>
        <a href="/account/orders" className="text-brand-600 mt-4 inline-block hover:underline">
          View all orders
        </a>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = STATUS_FLOW.indexOf(order.status);
  const isCancelled = ['cancelled', 'returned', 'refunded'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <a
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </a>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Order Number</p>
            <h1 className="text-2xl font-bold font-mono text-navy-800">
              {order.order_number}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
            <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
            <span className={`font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {!isCancelled && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-navy-800 mb-6">Order Progress</h2>
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-brand-600 transition-all duration-500"
              style={{
                height: `${Math.max(0, (currentStepIndex / (STATUS_FLOW.length - 1)) * 100)}%`,
              }}
            />

            <div className="space-y-6">
              {STATUS_FLOW.map((status, i) => {
                const config = STATUS_CONFIG[status];
                const Icon = config.icon;
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;

                return (
                  <div key={status} className="flex items-start gap-4 relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                          : 'bg-gray-100 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-brand-100 scale-110' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="pt-1.5">
                      <p
                        className={`font-semibold text-sm ${
                          isCompleted ? 'text-navy-800' : 'text-gray-400'
                        }`}
                      >
                        {config.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-brand-600 mt-0.5">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <XCircle className="w-10 h-10 text-red-500" />
          <div>
            <h3 className="font-bold text-red-700">Order {statusConfig.label}</h3>
            <p className="text-sm text-red-600">
              This order has been {order.status}. Contact support if you have questions.
            </p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600" /> Shipping Address
          </h3>
          {order.shipping_address && (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-navy-800">{order.shipping_address.name}</p>
              <p className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {order.shipping_address.phone}
              </p>
              {order.shipping_address.email && (
                <p className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {order.shipping_address.email}
                </p>
              )}
              <p className="mt-2">{order.shipping_address.full_address}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-navy-800 mb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-600" /> Delivery Info
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Zone</span>
              <span className="font-medium text-navy-800">{order.delivery_zone || 'Standard'}</span>
            </div>
            {order.courier_name && (
              <div className="flex justify-between">
                <span className="text-gray-500">Courier</span>
                <span className="font-medium text-navy-800">{order.courier_name}</span>
              </div>
            )}
            {order.tracking_number && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tracking #</span>
                <span className="font-mono font-medium text-brand-600">{order.tracking_number}</span>
              </div>
            )}
            {order.estimated_delivery && (
              <div className="flex justify-between">
                <span className="text-gray-500">Est. Delivery</span>
                <span className="font-medium text-navy-800">
                  {new Date(order.estimated_delivery).toLocaleDateString('en-GB')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {order.tracking?.tracking_history?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-navy-800 mb-4">Tracking History</h3>
          <div className="space-y-4">
            {[...order.tracking.tracking_history].reverse().map((event: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  i === 0 ? 'bg-brand-600' : 'bg-gray-300'
                }`} />
                <div>
                  <p className="text-sm font-medium text-navy-800 capitalize">
                    {event.status.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.location} • {event.time}
                  </p>
                  {event.note && (
                    <p className="text-xs text-gray-400 mt-0.5">{event.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="font-bold text-navy-800">
            Order Items ({order.items?.length})
          </h3>
          {showItems ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {showItems && (
          <div className="mt-4 space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400">Img</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800">{item.product_name}</p>
                  <p className="text-xs text-gray-400">
                    SKU: {item.product_sku}
                    {item.variant_name && ` • ${item.variant_name}`}
                  </p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-navy-800">
                  ৳{Number(item.total).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-navy-800 mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span>
            <span>৳{Number(order.subtotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping</span>
            <span>৳{Number(order.shipping_charge).toLocaleString()}</span>
          </div>
          {Number(order.coupon_discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Coupon ({order.coupon_code})</span>
              <span>-৳{Number(order.coupon_discount).toLocaleString()}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between text-lg font-bold text-navy-800 pt-2">
            <span>Total</span>
            <span>৳{Number(order.total).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm pt-2">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium text-navy-800 uppercase">{order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Payment Status</span>
            <span className={`font-medium ${
              order.payment_status === 'paid' ? 'text-green-600' :
              order.payment_status === 'failed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {order.payment_status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
