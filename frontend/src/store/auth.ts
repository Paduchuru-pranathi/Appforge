import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (token, user) => {
        localStorage.setItem('appforge_token', token);
        set({ token, user });
      },
      logout: () => {
        localStorage.removeItem('appforge_token');
        localStorage.removeItem('appforge_user');
        set({ token: null, user: null });
        window.location.href = '/login';
      },
      isAuthenticated: () => !!get().token && !!get().user,
    }),
    {
      name: 'appforge_auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
