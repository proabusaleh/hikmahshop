'use client';

import { useState } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, Calendar,
  Tag, Clock, TrendingUp, FileText, Image,
  CheckCircle, AlertCircle, Archive,
} from 'lucide-react';

const POSTS = [
  { id: 1, title: '10 Must-Have Gadgets for 2025', category: 'Tech', author: 'Admin', status: 'published', featured: true, views: 2450, date: '2025-01-15', readTime: 5 },
  { id: 2, title: 'Summer Fashion Guide: Stay Cool & Stylish', category: 'Fashion', author: 'Sadia', status: 'published', featured: false, views: 1890, date: '2025-01-12', readTime: 4 },
  { id: 3, title: 'How to Save More with HikmahShop Deals', category: 'Tips', author: 'Admin', status: 'published', featured: true, views: 3200, date: '2025-01-10', readTime: 3 },
  { id: 4, title: 'Best Skincare Routine for Bangladeshi Weather', category: 'Health', author: 'Nusrat', status: 'draft', featured: false, views: 0, date: '2025-01-08', readTime: 6 },
  { id: 5, title: 'Ramadan Shopping Guide 2025', category: 'Guide', author: 'Admin', status: 'draft', featured: false, views: 0, date: '2025-01-05', readTime: 7 },
];

type IconType = typeof FileText;

const statusConfig: Record<string, { icon: IconType; color: string }> = {
  published: { icon: CheckCircle, color: 'bg-green-100 text-green-700' },
  draft:     { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700' },
  archived:  { icon: Archive, color: 'bg-gray-100 text-gray-600' },
};

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Blog & Content</h1>
          <p className="text-gray-500 text-sm mt-1">Manage blog posts, pages, and SEO content</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: '24', icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: 'Published', value: '18', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          { label: 'Total Views', value: '45.2K', icon: Eye, color: 'bg-purple-100 text-purple-600' },
          { label: 'Avg Read Time', value: '4.2 min', icon: Clock, color: 'bg-orange-100 text-orange-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-navy-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search posts..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white">
            <option>All Categories</option>
            <option>Tech</option>
            <option>Fashion</option>
            <option>Health</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <th className="px-4 py-3 font-medium">Post</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Views</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {POSTS.map((post) => {
                const sc = statusConfig[post.status];
                const Icon = sc.icon;
                return (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image className="w-4 h-4 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy-800 max-w-[250px] truncate">{post.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <Clock className="w-3 h-3" /> {post.readTime} min
                            </span>
                            {post.featured && (
                              <span className="text-xs text-yellow-600 flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" /> Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{post.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{post.author}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${sc.color}`}>
                        <Icon className="w-3 h-3" /> {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-navy-800">{post.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{post.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-600"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}