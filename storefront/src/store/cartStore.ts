import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  get subtotal(): number;
  get total(): number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      couponDiscount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      clearCart: () => set({ items: [], coupon: null, couponDiscount: 0 }),

      applyCoupon: (code) => {
        if (code.toUpperCase() === 'HIKMAH10') {
          set({ coupon: code, couponDiscount: 10 });
        }
      },

      removeCoupon: () => set({ coupon: null, couponDiscount: 0 }),

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get total() {
        const sub = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const discount = get().couponDiscount;
        const delivery = sub >= 999 ? 0 : 60;
        return sub - (sub * discount) / 100 + delivery;
      },
    }),
    { name: 'hikmah-cart' }
  )
);
