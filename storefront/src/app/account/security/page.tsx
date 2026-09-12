'use client';

import { useState } from 'react';
import {
  Lock, Eye, EyeOff, Smartphone,
  CheckCircle, AlertTriangle, LogOut, Monitor,
} from 'lucide-react';

export default function SecurityPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [saved, setSaved] = useState(false);

  const sessions = [
    { device: 'Chrome on Windows', location: 'Dhaka, BD', ip: '103.48.16.xx', current: true, time: 'Now' },
    { device: 'Safari on iPhone', location: 'Dhaka, BD', ip: '103.48.16.xx', current: false, time: '2 hours ago' },
    { device: 'Firefox on Linux', location: 'Chittagong, BD', ip: '45.118.247.xx', current: false, time: '3 days ago' },
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-900">Security Settings</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-600" /> Change Password
        </h2>

        {saved && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Password updated successfully!
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                value={passwords.old}
                onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwords.new}
                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="••••••••"
            />
            {passwords.confirm && passwords.new !== passwords.confirm && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Passwords don&apos;t match
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h2 className="font-bold text-navy-900">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-brand-600" /> Active Sessions
        </h2>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-navy-800 flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-bold">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {session.location} &bull; {session.ip} &bull; {session.time}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs text-red-500 hover:underline font-medium">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-red-500 hover:underline font-medium flex items-center gap-1">
          <LogOut className="w-3.5 h-3.5" /> Logout from all other devices
        </button>
      </div>

      <div className="bg-white rounded-2xl border-2 border-red-200 p-6">
        <h2 className="font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. All data will be permanently removed.
        </p>
        <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
          Delete My Account
        </button>
      </div>
    </div>
  );
}
