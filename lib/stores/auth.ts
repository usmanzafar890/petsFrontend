import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { signUp, login, getUserProfile } from '../api/auth';
import type { User, SignUpData, LoginData } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // To track the initial auth check
  login: (data: LoginData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isInitializing: true, // Start with true on app load
      login: async (data) => {
        const response = await login(data);
        set({ token: response.token, isAuthenticated: true });
        await get().checkAuth();
      },
      signUp: async (data) => {
        const response = await signUp(data);
        set({ token: response.token, isAuthenticated: true });
        await get().checkAuth();
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, isInitializing: false });
      },
      checkAuth: async () => {
        if (!get().token) {
          set({ isInitializing: false, isAuthenticated: false });
          return;
        }
        try {
          const user = await getUserProfile();
          set({ user, isAuthenticated: true, isInitializing: false });
        } catch (error) {
          set({ token: null, user: null, isAuthenticated: false, isInitializing: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), 
    }
  )
);

export const getToken = () => useAuthStore.getState().token;
export const logout = () => useAuthStore.getState().logout();
