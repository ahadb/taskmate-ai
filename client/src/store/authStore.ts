import { create } from "zustand";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface User {
  email: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  login: (token: string, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));
