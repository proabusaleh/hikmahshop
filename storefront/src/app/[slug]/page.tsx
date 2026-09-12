'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function CmsPageView() {
  const params = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/${params.slug}`)
      .then(({ data }) => setPage(data.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
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
        <a href="/" className="text-brand-600 mt-4 inline-block hover:underline">Go Home</a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-display text-navy-900 mb-8">{page.title}</h1>
      <div
        className="prose prose-lg max-w-none prose-headings:text-navy-900 prose-a:text-brand-600"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}