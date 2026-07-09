import { create } from "zustand";
import type { WalletData, WalletTransaction } from "../types/wallet.types";
import { getWalletMe, getWalletTransactions } from "../api/walletApi";
import { useAuthStore } from "@/features/auth/store/authStore";

interface WalletState {
  wallet: WalletData;
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;

  fetchWalletDetails: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  setWalletBalance: (balance: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallet: {
    balance: 0,
    rewardPoints: 0,
    totalSpent: 0,
  },
  transactions: [],
  loading: false,
  error: null,

  fetchWalletDetails: async () => {
    try {
      set({ loading: true, error: null });
      const walletData = await getWalletMe();
      set({ wallet: walletData });

      // Update auth store user details to sync layout instantly
      const authUser = useAuthStore.getState().user;
      const updateUser = useAuthStore.getState().updateUser;
      if (authUser && updateUser) {
        updateUser({
          ...authUser,
          walletBalance: walletData.balance,
          rewardPoints: walletData.rewardPoints,
        });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch wallet details" });
    } finally {
      set({ loading: false });
    }
  },

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const txs = await getWalletTransactions();
      set({ transactions: txs });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch transactions" });
    } finally {
      set({ loading: false });
    }
  },

  setWalletBalance: (balance: number) => {
    const currentWallet = get().wallet;
    const updatedWallet = { ...currentWallet, balance };
    set({ wallet: updatedWallet });

    // Sync auth store
    const authUser = useAuthStore.getState().user;
    const updateUser = useAuthStore.getState().updateUser;
    if (authUser && updateUser) {
      updateUser({
        ...authUser,
        walletBalance: balance,
      });
    }
  },
}));
