import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      fetchWishlist: async () => {
        set({ loading: true });
        try {
          const { data } = await api.get('/wishlist');
          const products = Array.isArray(data) ? data : data?.data || [];
          set({ items: products, loading: false });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
          set({ loading: false });
        }
      },

      toggleWishlist: async (product) => {
        const { items } = get();
        const isInWishlist = items.some(i => i.id === product.id);
        
        try {
          // Optimistic update
          if (isInWishlist) {
            set({ items: items.filter(i => i.id !== product.id) });
          } else {
            set({ items: [...items, product] });
          }

          // API call
          await api.post(`/wishlist/${product.id}`);
        } catch (error) {
          // Rollback on error
          console.error('Failed to toggle wishlist:', error);
          set({ items });
          throw error;
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(i => i.id === productId);
      },

      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
