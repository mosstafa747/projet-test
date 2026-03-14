import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (token) localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      fetchProfile: async () => {
        try {
          const { data } = await api.get('/users/profile');
          set((s) => ({ ...s, user: data }));
          return data;
        } catch {
          set({ user: null, token: null });
          return null;
        }
      },
      updateProfile: async (data) => {
        const r = await api.put('/users/profile', data);
        set((s) => ({ ...s, user: r.data.user }));
        return r.data;
      },
      deleteAccount: async () => {
        await api.delete('/users/account');
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    { name: 'auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
