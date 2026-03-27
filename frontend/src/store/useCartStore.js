import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [], // { productId, product: { id, name, price, images }, quantity }
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          let next;
          if (existing) {
            next = state.items.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
            );
          } else {
            next = [...state.items, { productId: product.id, product, quantity }];
          }
          return { items: next };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) return { items: state.items.filter((i) => i.productId !== productId) };
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity } : i
            ),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart' }
  )
);
