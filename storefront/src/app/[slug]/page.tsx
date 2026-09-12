'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const POLICY_TYPES: Record<string, string> = {
  'terms': 'terms',
  'terms-of-service': 'terms',
  'privacy': 'privacy',
  'privacy-policy': 'privacy',
  'shipping': 'shipping_policy',
  'shipping-policy': 'shipping_policy',
  'returns': 'return_policy',
  'return-policy': 'return_policy',
};

export default function CmsPageView() {
  const params = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const slug = params.slug;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/pages/${slug}`);
        if (!cancelled) setPage(data.data);
      } catch {
        const type = POLICY_TYPES[slug as string];
        if (type) {
          try {
            const { data } = await api.get(`/policies/${type}`);
            if (!cancelled) setPage(data.data);
            else return;
            return;
          } catch {
            if (!cancelled) setPage(null);
            return;
          }
        }
        if (!cancelled) setPage(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy-900">Page Not Found</h1>
        <p className="text-gray-500 mt-2">The page you are looking for doesn&apos;t exist.</p>
        <a href="/" className="text-brand-600 mt-4 inline-block hover:underline">Go Home</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-display text-navy-900 mb-8">{page.title}</h1>
      {page.version && (
        <p className="text-sm text-gray-400 mb-4">Version {page.version}</p>
      )}
      <div
        className="prose prose-lg max-w-none prose-headings:text-navy-900 prose-a:text-brand-600"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}