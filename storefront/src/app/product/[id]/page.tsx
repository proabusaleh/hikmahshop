'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star, Heart, ShoppingCart, Zap, Truck, Shield, RotateCcw,
  ChevronRight, Minus, Plus, Share2, Loader2,
} from 'lucide-react';
import ProductCard from '@/components/shared/ProductCard';
import ReviewSection from '@/components/product/ReviewSection';
import api from '@/lib/api';
import { toCardProduct } from '@/lib/products';
import type { ApiProduct, CardProduct } from '@/lib/products';

interface Variant {
  id: number;
  name: string;
  price: number;
  stock: number;
  attributes: { attribute: string | null; value: string; color?: string | null }[];
}

interface ColorOption {
  label: string;
  hex: string;
  variantId: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [related, setRelated] = useState<CardProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/related`),
    ])
      .then(([{ data: pData }, { data: rData }]) => {
        setProduct(pData.data ?? null);
        setRelated((rData.data ?? []).map(toCardProduct));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-32">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold text-navy-800">Product not found</h1>
        <a href="/shop" className="mt-4 inline-block text-brand-600 font-semibold">
          Back to Shop
        </a>
      </div>
    );
  }

  const variants: Variant[] = product.variants ?? [];
  const effectivePrice = selectedVariant?.price ?? product.price;
  const originalPrice: number | null = product.original_price ?? null;
  const images: { url: string; alt?: string }[] = (product.images ?? []).filter(
    (img) => img?.url
  );
  const hasImages = images.length > 0;
  const activeImage = hasImages ? images[Math.min(selectedImage, images.length - 1)] : null;

  const colorOptions: ColorOption[] = variants
    .flatMap((v) =>
      (v.attributes ?? [])
        .filter((a) => (a.attribute?.toLowerCase().includes('color') ?? false) && a.color)
        .map((a) => ({ label: `${a.attribute}: ${a.value}`, hex: a.color as string, variantId: v.id }))
    );

  const discount = originalPrice
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;

  const selectVariant = (v: Variant) => setSelectedVariant(v);

  const specs = Object.fromEntries(
    variants
      .flatMap((v) => v.attributes ?? [])
      .map((a) => [a.attribute ?? 'Attribute', a.value])
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-gray-400 mb-8">
        <a href="/" className="hover:text-brand-600">Home</a>
        <ChevronRight className="w-3 h-3" />
        <a href="/shop" className="hover:text-brand-600">Shop</a>
        {product.category?.slug && (
          <>
            <ChevronRight className="w-3 h-3" />
            <a
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-brand-600"
            >
              {product.category.name}
            </a>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-navy-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center mb-4 overflow-hidden relative"
          >
            {activeImage ? (
              <img
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-300 text-lg">Product Image</span>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-xl">
                -{discount}%
              </span>
            )}
          </motion.div>

          {hasImages && images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center transition ${
                    selectedImage === i
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand?.name && (
            <p className="text-sm text-brand-600 font-semibold mb-1">{product.brand.name}</p>
          )}
          <h1 className="text-2xl md:text-3xl font-bold font-display text-navy-800 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-navy-800">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.review_count.toLocaleString()} reviews)</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-green-600 font-medium">{product.sales_count.toLocaleString()} sold</span>
          </div>

          <div className="flex items-baseline gap-3 mt-6">
            <span className="text-4xl font-bold text-brand-600">
              ৳{effectivePrice.toLocaleString()}
            </span>
            {originalPrice && originalPrice > effectivePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">
                  Save ৳{(originalPrice - effectivePrice).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {product.short_description && (
            <p className="text-gray-500 mt-4 leading-relaxed">{product.short_description}</p>
          )}

          {colorOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-navy-800 mb-2">Color</p>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map((color, i) => {
                  const active = selectedVariant?.id === color.variantId;
                  return (
                    <button
                      key={color.variantId}
                      onClick={() => {
                        const v = variants.find((x) => x.id === color.variantId);
                        if (v) selectVariant(v);
                      }}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        active
                          ? 'border-brand-600 ring-2 ring-brand-200 scale-110'
                          : 'border-gray-200 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm font-semibold text-navy-800 mb-2">Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(Math.max(product.stock, 1), quantity + 1))}
                className="p-3 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="ml-3 text-sm text-gray-400">
              {selectedVariant?.stock ?? product.stock} items available
            </span>
          </div>

          <div className="flex gap-3 mt-8">
            <button className="flex-1 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-200">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button className="py-4 px-6 bg-navy-800 text-white rounded-xl font-bold hover:bg-navy-900 transition flex items-center gap-2">
              <Zap className="w-5 h-5" /> Buy Now
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`p-4 rounded-xl border-2 transition ${
                liked ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-4 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-brand-200 hover:text-brand-600 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { icon: Truck, text: 'Free Delivery' },
              { icon: Shield, text: 'Secure Pay' },
              { icon: RotateCcw, text: '7-Day Return' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <badge.icon className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-medium text-gray-600">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="flex border-b border-gray-200 gap-1">
          {([
            { key: 'desc', label: 'Description' },
            { key: 'specs', label: 'Specifications' },
            { key: 'reviews', label: `Reviews (${product.review_count})` },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition -mb-px ${
                activeTab === tab.key
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'desc' && (
            <div className="max-w-3xl">
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              {Object.keys(specs).length === 0 ? (
                <p className="text-gray-400 text-sm">No specifications available.</p>
              ) : (
                <table className="w-full">
                  <tbody>
                    {Object.entries(specs).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-3 text-sm font-medium text-navy-800 w-1/3">{key}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewSection
              productId={product.id}
              avgRating={product.rating}
              reviewCount={product.review_count}
            />
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 mb-8">
          <h2 className="text-2xl font-bold font-display text-navy-800 mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}