import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("accessToken");
    return email && token ? { email } : null;
  })(),

  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    set({ user: null });
  },
}));
