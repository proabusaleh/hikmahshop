'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Clock, TrendingUp, ArrowRight,
  Package, Tag, ChevronRight, Loader2,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Suggestion {
  products: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
    original_price: number | null;
    image: string | null;
  }>;
  categories: Array<{ type: string; name: string; slug: string }>;
  brands: Array<{ type: string; name: string; slug: string }>;
}

export default function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion | null>(null);
  const [popular, setPopular] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!isOpen) return;

    api.get('/search/popular').then(({ data }) => {
      setPopular(data.data.map((t: any) => t.term).slice(0, 8));
    }).catch(() => {});

    if (user) {
      api.get('/search/recent').then(({ data }) => {
        setRecent(data.data);
      }).catch(() => {});
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, user]);

  const fetchSuggestions = useCallback(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setSuggestions(null);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get('/search/suggestions', { params: { q } });
        setSuggestions(data.data);
      } catch {
        setSuggestions(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleSearch = (term?: string) => {
    const q = term || query;
    if (!q.trim()) return;
    onClose();
    router.push(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  const clearRecent = async () => {
    try {
      await api.delete('/search/recent');
      setRecent([]);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="max-w-3xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <Search className="w-5 h-5 text-brand-600" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search products, brands, categories..."
              className="flex-1 text-lg outline-none bg-transparent text-navy-800 placeholder-gray-400"
            />
            {loading && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
            {query && (
              <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs text-gray-400 font-mono">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {query.length >= 2 && suggestions ? (
              <div className="p-4 space-y-4">
                {suggestions.categories.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                      Categories
                    </p>
                    {suggestions.categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => { onClose(); router.push(`/categories/${cat.slug}`); }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-brand-50 text-left transition"
                      >
                        <Tag className="w-4 h-4 text-brand-600" />
                        <span
                          className="text-sm text-navy-800"
                          dangerouslySetInnerHTML={{ __html: cat.name }}
                        />
                        <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.brands.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                      Brands
                    </p>
                    {suggestions.brands.map((brand) => (
                      <button
                        key={brand.slug}
                        onClick={() => { onClose(); router.push(`/shop?brand=${brand.slug}`); }}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-brand-50 text-left transition"
                      >
                        <Tag className="w-4 h-4 text-purple-600" />
                        <span
                          className="text-sm text-navy-800"
                          dangerouslySetInnerHTML={{ __html: brand.name }}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.products.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                      Products
                    </p>
                    {suggestions.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => { onClose(); router.push(`/product/${product.slug}`); }}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-brand-50 text-left transition"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium text-navy-800 truncate"
                            dangerouslySetInnerHTML={{ __html: product.name }}
                          />
                          <p className="text-xs text-gray-400">
                            ৳{product.price.toLocaleString()}
                            {product.original_price && (
                              <span className="line-through ml-1">
                                ৳{product.original_price.toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleSearch()}
                  className="w-full py-3 bg-brand-50 text-brand-600 rounded-xl text-sm font-semibold hover:bg-brand-100 transition flex items-center justify-center gap-2"
                >
                  View all results for "{query}" <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : query.length < 2 ? (
              <div className="p-4 space-y-6">
                {recent.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2 px-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Recent Searches
                      </p>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 px-2">
                      {recent.map((term) => (
                        <button
                          key={term}
                          onClick={() => { setQuery(term); handleSearch(term); }}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-brand-50 hover:text-brand-600 transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {popular.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {popular.map((term) => (
                        <button
                          key={term}
                          onClick={() => { setQuery(term); handleSearch(term); }}
                          className="px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-sm hover:bg-brand-100 transition font-medium"
                        >
                          🔥 {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
                    Browse Categories
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-2">
                    {['Electronics', 'Fashion', 'Home', 'Health'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { onClose(); router.push(`/categories/${cat.toLowerCase()}`); }}
                        className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-navy-700 hover:bg-brand-50 hover:text-brand-600 transition text-center"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No suggestions found for "{query}"</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-3 text-brand-600 text-sm font-medium hover:underline"
                >
                  Search anyway →
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
