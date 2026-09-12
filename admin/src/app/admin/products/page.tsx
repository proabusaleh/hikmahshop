'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, ChevronLeft, ChevronRight, Package,
} from 'lucide-react';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Premium Wireless Noise-Cancelling Headphones Pro Max', sku: 'HS-ANC-001', price: 4599, original: 7999, stock: 23, category: 'Electronics', brand: 'SoundElite', rating: 4.8 },
  { id: 2, name: 'Wireless Bluetooth Earbuds Pro', sku: 'HS-EB-001', price: 1299, original: 1999, stock: 45, category: 'Electronics', brand: 'TechNova', rating: 4.5 },
  { id: 3, name: 'Smart Watch Ultra S2', sku: 'HS-SW-002', price: 3499, original: null, stock: 12, category: 'Electronics', brand: 'TechNova', rating: 4.6 },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<typeof FALLBACK_PRODUCTS>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    fetch(`${apiUrl}/products?per_page=100`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (!json.success) return;
        const rows = (json.data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || '—',
          price: p.price,
          original: p.original_price,
          stock: p.stock,
          category: p.category?.name ?? '—',
          brand: p.brand?.name ?? '—',
          rating: p.rating,
        }));
        setProducts(rows);
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading…' : `${products.length} products in catalog`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading products…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Brand</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-navy-800 max-w-[280px] truncate">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{p.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.brand}</td>
                    <td className="px-4 py-3 text-sm font-bold text-navy-800 text-right">
                      <span>৳{p.price.toLocaleString()}</span>
                      {p.original && (
                        <span className="block text-xs font-normal text-gray-400 line-through">
                          ৳{p.original.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                          p.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : p.stock > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <Package className="w-3 h-3" /> {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">★ {p.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No products found</div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-400">Page 1 of 1</p>
          <div className="flex gap-1">
            <button disabled className="p-2 rounded-lg border border-gray-200 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled className="p-2 rounded-lg border border-gray-200 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}