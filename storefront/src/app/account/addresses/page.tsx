'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';

const ADDRESSES = [
  { id: 1, name: 'Rahim Uddin', phone: '01712345678', address: 'House 45, Road 12, Dhanmondi', city: 'Dhaka', district: 'Dhaka', division: 'Dhaka', zip: '1205', isDefault: true, type: 'Home' },
  { id: 2, name: 'Rahim Uddin', phone: '01712345678', address: 'Level 5, Tower B, Gulshan 2', city: 'Dhaka', district: 'Dhaka', division: 'Dhaka', zip: '1212', isDefault: false, type: 'Office' },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(ADDRESSES);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">My Addresses</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-2xl border-2 p-5 relative ${
              addr.isDefault ? 'border-brand-600' : 'border-gray-100'
            }`}
          >
            {addr.isDefault && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-brand-100 text-brand-700 text-[10px] font-bold rounded-full flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3" /> Default
              </span>
            )}
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
              {addr.type}
            </span>
            <div className="mt-3 space-y-1">
              <p className="font-semibold text-navy-800">{addr.name}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
              <p className="text-sm text-gray-600 mt-2">{addr.address}</p>
              <p className="text-sm text-gray-500">
                {addr.city}, {addr.district} – {addr.zip}
              </p>
              <p className="text-sm text-gray-500">{addr.division}</p>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1 text-sm text-brand-600 hover:underline">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              {!addr.isDefault && (
                <>
                  <button className="text-sm text-gray-400 hover:text-brand-600">Set Default</button>
                  <button className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-brand-300 hover:bg-brand-50/30 transition min-h-[200px]">
          <Plus className="w-8 h-8 text-gray-300" />
          <span className="text-sm font-medium text-gray-400">Add New Address</span>
        </button>
      </div>
    </div>
  );
}