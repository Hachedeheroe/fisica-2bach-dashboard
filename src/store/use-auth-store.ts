import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  lastActive: string | null;
  setLastActive: (date: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      lastActive: null,
      setLastActive: (date) => set({ lastActive: date }),
    }),
    {
      name: 'auth-store',
    }
  )
);