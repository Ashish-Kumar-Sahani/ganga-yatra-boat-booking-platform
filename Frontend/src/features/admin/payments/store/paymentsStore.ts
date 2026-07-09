import { create } from "zustand";
import { getTransactionsAdmin } from "../api/paymentsApi";

interface PaymentsState {
  summary: any | null;
  transactions: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  fetchPayments: (params?: any) => Promise<void>;
}

export const useAdminPaymentsStore = create<PaymentsState>((set) => ({
  summary: null,
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,

  fetchPayments: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await getTransactionsAdmin(params);
      if (res.success) {
        set({
          summary: res.summary,
          transactions: res.transactions,
          pagination: res.pagination,
          loading: false,
        });
      } else {
        set({ error: res.message || "Failed to load transactions", loading: false });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to load transactions", loading: false });
    }
  },
}));
