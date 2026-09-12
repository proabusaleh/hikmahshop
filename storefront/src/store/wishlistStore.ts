import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id);
          return exists
            ? { items: state.items.filter((i) => i.id !== item.id) }
            : { items: [...state.items, item] };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      isInWishlist: (id) => get().items.some((i) => i.id === id),
    }),
    { name: 'hikmah-wishlist' }
  )
);
