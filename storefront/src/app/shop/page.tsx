'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  Search,
  Loader2,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import api from '@/lib/api';
import { toCardProduct } from '@/lib/products';
import type { ApiProduct, CardProduct } from '@/lib/products';

const PRICE_RANGES = [
  { label: 'Under ৳500', min: 0, max: 500 },
  { label: '৳500 – ৳1,000', min: 500, max: 1000 },
  { label: '৳1,000 – ৳3,000', min: 1000, max: 3000 },
  { label: '৳3,000 – ৳5,000', min: 3000, max: 5000 },
  { label: '৳5,000+', min: 5000, max: Infinity },
];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const PER_PAGE = 12;

function ShopContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);

  const [products, setProducts] = useState<CardProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [brands, setBrands] = useState<string[]>([]);
  const [categorySlugs, setCategorySlugs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Apply URL-level flags (category / trending / flash_sale / etc. from home links)
  const urlCategory = searchParams.get('category');
  const urlFlag = searchParams.get('trending') || searchParams.get('flash_sale') || searchParams.get('new_arrival') || searchParams.get('best_seller');

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      const list: { name: string; slug: string }[] = data.data ?? [];
      if (list.length) {
        setCategories(['All', ...list.map((c) => c.name)]);
        setCategorySlugs(Object.fromEntries(list.map((c) => [c.name, c.slug])));
      }
    }).catch(() => {});
    api.get('/products', { params: { per_page: 100 } }).then(({ data }) => {
      const list: ApiProduct[] = data.data ?? [];
      const bs = Array.from(new Set(list.map((p) => p.brand?.name).filter(Boolean) as string[]));
      setBrands(bs);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | boolean> = {
      sort,
      per_page: PER_PAGE,
      page,
    };

    const requestedSlug =
      selectedCategory === 'All'
        ? urlCategory ?? undefined
        : categorySlugs[selectedCategory];

    if (requestedSlug) params.category = requestedSlug;
    if (urlFlag) params[urlFlag as string] = 1;
    if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');

    api
      .get('/products', { params })
      .then(({ data }) => {
        setProducts((data.data ?? []).map(toCardProduct));
        setTotal(data.meta?.total ?? data.data?.length ?? 0);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrands, sort, page, urlCategory, urlFlag, categorySlugs]);

  // Client-side price range + rating filter (API supports them, but keep simple)
  const filtered = useMemo(() => {
    let result = products;
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }
    return result;
  }, [products, selectedPrice, minRating]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const paginated = filtered.slice(0, PER_PAGE);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedBrands.length +
    (selectedPrice !== null ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const clearAll = () => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setSelectedPrice(null);
    setMinRating(0);
    setPage(1);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold text-navy-800 mb-3">Category</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setPage(1); }}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-navy-800 mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range, i) => (
            <label
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 text-sm"
            >
              <input
                type="radio"
                name="price"
                checked={selectedPrice === i}
                onChange={() => { setSelectedPrice(i); setPage(1); }}
                className="accent-brand-600"
              />
              <span className="text-gray-600">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-navy-800 mb-3">Brand</h3>
        <div className="space-y-1.5">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-brand-600 rounded"
              />
              <span className="text-gray-600">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-navy-800 mb-3">Minimum Rating</h3>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => { setMinRating(minRating === r ? 0 : r); setPage(1); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition ${
                minRating === r ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < r ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <a href="/" className="hover:text-brand-600">Home</a>
        <span className="mx-2">/</span>
        <span className="text-navy-800 font-medium">Shop</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-navy-800">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `Showing ${paginated.length} of ${total} products`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium relative"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="hidden md:flex border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
              {b}
              <button onClick={() => toggleBrand(b)}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs text-red-500 hover:underline ml-2">
            Clear All
          </button>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6">
            <FilterSidebar />
          </div>
        </aside>

        <AnimatePresence>
          {mobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="absolute left-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button onClick={() => setMobileFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar />
                <button
                  onClick={() => setMobileFilters(false)}
                  className="mt-8 w-full py-3 bg-brand-600 text-white rounded-xl font-semibold"
                >
                  Apply Filters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center py-24">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
              <p className="text-gray-500 text-sm">Loading products…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy-800">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              <button onClick={clearAll} className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium">
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              className={
                view === 'grid'
                  ? 'grid grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              {paginated.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition ${
                        page === p
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-200'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  );
}