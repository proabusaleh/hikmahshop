'use client';

import { useState } from 'react';
import {
  Package, Search, Filter, AlertTriangle, XCircle,
  CheckCircle, ArrowUpCircle, ArrowDownCircle,
  Settings2, Download, Plus, History,
  Warehouse, TrendingDown,
} from 'lucide-react';

const INVENTORY = [
  { id: 1, sku: 'EAR-WLS-001', name: 'Wireless Earbuds Pro', category: 'Electronics', stock: 80, threshold: 10, price: 1299, cost: 650, warehouse: 'Dhaka Central', status: 'in_stock' },
  { id: 2, sku: 'TSH-BLK-001', name: 'Cotton T-Shirt', category: 'Fashion', stock: 8, threshold: 15, price: 599, cost: 250, warehouse: 'Dhaka Central', status: 'low_stock' },
  { id: 3, sku: 'WCH-SMT-001', name: 'Smart Watch Ultra', category: 'Electronics', stock: 3, threshold: 10, price: 3499, cost: 1800, warehouse: 'Dhaka Central', status: 'low_stock' },
  { id: 4, sku: 'SHO-RUN-001', name: 'Running Shoes X1', category: 'Fashion', stock: 0, threshold: 10, price: 1899, cost: 900, warehouse: 'Chittagong', status: 'out_of_stock' },
  { id: 5, sku: 'PHN-5G-001', name: 'Xiaomi 14 Ultra', category: 'Electronics', stock: 20, threshold: 5, price: 49999, cost: 38000, warehouse: 'Dhaka Central', status: 'in_stock' },
  { id: 6, sku: 'BAG-VYG-001', name: 'Backpack Voyager', category: 'Fashion', stock: 0, threshold: 10, price: 899, cost: 350, warehouse: 'Dhaka Central', status: 'out_of_stock' },
  { id: 7, sku: 'SPK-BLT-001', name: 'Bluetooth Speaker', category: 'Electronics', stock: 45, threshold: 10, price: 799, cost: 320, warehouse: 'Chittagong', status: 'in_stock' },
  { id: 8, sku: 'CRM-FAC-001', name: 'Organic Face Cream', category: 'Health', stock: 5, threshold: 20, price: 899, cost: 280, warehouse: 'Dhaka Central', status: 'low_stock' },
];

const HISTORY = [
  { ref: 'INV-20250115-A1B2', type: 'stock_in', product: 'Wireless Earbuds Pro', qty: 50, prev: 30, new: 80, by: 'Admin', date: 'Jan 15, 2:30 PM', reason: 'Purchase Order PO-001' },
  { ref: 'INV-20250114-C3D4', type: 'stock_out', product: 'Cotton T-Shirt', qty: -12, prev: 20, new: 8, by: 'System', date: 'Jan 14, 6:00 PM', reason: 'Order fulfillment' },
  { ref: 'INV-20250113-E5F6', type: 'adjustment', product: 'Running Shoes X1', qty: -2, prev: 2, new: 0, by: 'Admin', date: 'Jan 13, 11:00 AM', reason: 'Damaged items written off' },
  { ref: 'INV-20250112-G7H8', type: 'stock_in', product: 'Smart Watch Ultra', qty: 10, prev: 0, new: 10, by: 'Admin', date: 'Jan 12, 3:00 PM', reason: 'Supplier delivery' },
];

type LucideIcon = typeof Package;

const statusConfig: Record<string, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  in_stock:     { icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-100',  label: 'In Stock' },
  low_stock:    { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Low Stock' },
  out_of_stock: { icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-100',    label: 'Out of Stock' },
};

const typeConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  stock_in:   { icon: ArrowUpCircle,   color: 'text-green-600',  label: 'Stock In' },
  stock_out:  { icon: ArrowDownCircle, color: 'text-red-600',    label: 'Stock Out' },
  adjustment: { icon: Settings2,       color: 'text-blue-600',   label: 'Adjustment' },
  return:     { icon: ArrowUpCircle,   color: 'text-purple-600', label: 'Return' },
};

export default function InventoryPage() {
  const [tab, setTab] = useState<'inventory' | 'history' | 'low-stock'>('inventory');
  const [search, setSearch] = useState('');
  const [showStockIn, setShowStockIn] = useState(false);

  const filtered = INVENTORY.filter((p) => {
    if (tab === 'low-stock' && p.status === 'in_stock') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const summary = {
    total: INVENTORY.length,
    inStock: INVENTORY.filter((p) => p.status === 'in_stock').length,
    lowStock: INVENTORY.filter((p) => p.status === 'low_stock').length,
    outOfStock: INVENTORY.filter((p) => p.status === 'out_of_stock').length,
    totalValue: INVENTORY.reduce((s, p) => s + p.stock * p.cost, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Inventory Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track stock levels, movements, and adjustments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStockIn(!showStockIn)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            <Plus className="w-4 h-4" /> Stock In
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total SKUs', value: summary.total, icon: Package, color: 'bg-blue-100 text-blue-600' },
          { label: 'In Stock', value: summary.inStock, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          { label: 'Low Stock', value: summary.lowStock, icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
          { label: 'Out of Stock', value: summary.outOfStock, icon: XCircle, color: 'bg-red-100 text-red-600' },
          { label: 'Stock Value', value: `৳${(summary.totalValue / 100000).toFixed(1)}L`, icon: Warehouse, color: 'bg-purple-100 text-purple-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">{card.label}</span>
            </div>
            <p className="text-xl font-bold text-navy-900">{card.value}</p>
          </div>
        ))}
      </div>

      {showStockIn && (
        <div className="bg-white rounded-2xl border-2 border-brand-200 p-6 shadow-lg">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <ArrowUpCircle className="w-5 h-5 text-green-600" /> Stock In
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Select product...</option>
                {INVENTORY.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="1"
                placeholder="0"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (৳)</label>
              <input
                type="number"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Dhaka Central</option>
                <option>Chittagong Hub</option>
                <option>Sylhet Warehouse</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason / Notes</label>
            <input
              type="text"
              placeholder="e.g., Purchase Order PO-20250115-001"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition">
              Confirm Stock In
            </button>
            <button
              onClick={() => setShowStockIn(false)}
              className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 bg-white rounded-2xl border border-gray-100 p-2">
        {[
          { key: 'inventory' as const, label: 'All Inventory', icon: Package },
          { key: 'low-stock' as const, label: 'Low / Out of Stock', icon: TrendingDown },
          { key: 'history' as const, label: 'Transaction History', icon: History },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === t.key
                ? 'bg-brand-600 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {(tab === 'inventory' || tab === 'low-stock') && (
        <>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or SKU..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">SKU</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium text-center">Stock</th>
                    <th className="px-4 py-3 font-medium text-center">Threshold</th>
                    <th className="px-4 py-3 font-medium text-right">Price</th>
                    <th className="px-4 py-3 font-medium text-right">Cost</th>
                    <th className="px-4 py-3 font-medium text-right">Value</th>
                    <th className="px-4 py-3 font-medium">Warehouse</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((item) => {
                    const config = statusConfig[item.status];
                    const Icon = config.icon;
                    const stockPercent = Math.min(100, (item.stock / Math.max(item.threshold * 3, 1)) * 100);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-navy-800 max-w-[180px] truncate">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-500">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-bold ${
                              item.stock === 0 ? 'text-red-600' :
                              item.stock <= item.threshold ? 'text-orange-600' : 'text-navy-800'
                            }`}>
                              {item.stock}
                            </span>
                            <div className="w-12 bg-gray-100 rounded-full h-1 mt-1">
                              <div
                                className={`h-1 rounded-full ${
                                  item.stock === 0 ? 'bg-red-500' :
                                  item.stock <= item.threshold ? 'bg-orange-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${stockPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-400">{item.threshold}</td>
                        <td className="px-4 py-3 text-sm text-right font-medium">৳{item.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-500">৳{item.cost.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-navy-800">
                          ৳{(item.stock * item.cost).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.warehouse}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
                            <Icon className="w-3 h-3" /> {config.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              title="Stock In"
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </button>
                            <button
                              title="Stock Out"
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                            >
                              <ArrowDownCircle className="w-4 h-4" />
                            </button>
                            <button
                              title="Adjust"
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                            >
                              <Settings2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-navy-900">Recent Transactions</h3>
            <div className="flex gap-2">
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option>All Types</option>
                <option>Stock In</option>
                <option>Stock Out</option>
                <option>Adjustment</option>
                <option>Return</option>
              </select>
              <input
                type="date"
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium text-center">Qty</th>
                  <th className="px-4 py-3 font-medium text-center">Before</th>
                  <th className="px-4 py-3 font-medium text-center">After</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">By</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {HISTORY.map((txn) => {
                  const config = typeConfig[txn.type];
                  const Icon = config.icon;
                  return (
                    <tr key={txn.ref} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3 text-sm font-mono font-medium text-brand-600">
                        {txn.ref}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${config.color}`}>
                          <Icon className="w-3.5 h-3.5" /> {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-navy-800">{txn.product}</td>
                      <td className={`px-4 py-3 text-center text-sm font-bold ${
                        txn.qty > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {txn.qty > 0 ? `+${txn.qty}` : txn.qty}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{txn.prev}</td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-navy-800">{txn.new}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{txn.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{txn.by}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{txn.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}