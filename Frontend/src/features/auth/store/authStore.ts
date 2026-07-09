import { create } from "zustand";

import type {
  User,
} from "../types/auth.types";

interface AuthState {
  user: User | null;

  token: string | null;

  isAuthenticated: boolean;

  login: (
    user: User,
    token: string
  ) => void;

  logout: () => void;

  updateUser: (
    user: Partial<User>
  ) => void;
}

const savedUser =
  localStorage.getItem("user");

const savedToken =
  localStorage.getItem("token");

export const useAuthStore =
  create<AuthState>((set) => ({
    user:
      savedUser && savedToken
        ? JSON.parse(savedUser)
        : null,

    token: savedToken || null,

    isAuthenticated:
      Boolean(
        savedUser && savedToken
      ),

    login: (user, token) => {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "token",
        token
      );

      set({
        user,
        token,
        isAuthenticated: true,
      });
    },

    logout: () => {
      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },

    updateUser: (user) => {
      set((state) => {
        const mergedUser = state.user ? { ...state.user, ...user } : (user as User);
        localStorage.setItem(
          "user",
          JSON.stringify(mergedUser)
        );
        return { user: mergedUser };
      });
    },
  }));