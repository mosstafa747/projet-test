import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [], // { cartItemId, productId, variantId, product, variant, quantity }
      addItem: (product, quantity = 1, variant = null) =>
        set((state) => {
          const cartItemId = variant ? `${product.id}_${variant.id}` : `${product.id}`;
          const existing = state.items.find((i) => i.cartItemId === cartItemId);
          
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
              )
            };
          } else {
            return {
              items: [...state.items, { 
                cartItemId, 
                productId: product.id, 
                variantId: variant ? variant.id : null,
                product, 
                variant, 
                quantity 
              }]
            };
          }
        }),
      updateQuantity: (cartItemId, quantity) =>
        set((state) => {
          if (quantity <= 0) return { items: state.items.filter((i) => i.cartItemId !== cartItemId) };
          return {
            items: state.items.map((i) =>
              i.cartItemId === cartItemId ? { ...i, quantity } : i
            ),
          };
        }),
      removeItem: (cartItemId) =>
        set((state) => ({ items: state.items.filter((i) => i.cartItemId !== cartItemId) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'cart' }
  )
);
