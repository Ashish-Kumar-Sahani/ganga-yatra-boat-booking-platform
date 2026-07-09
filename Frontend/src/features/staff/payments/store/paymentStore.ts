// src/features/staff/payments/store/paymentStore.ts

import { create } from "zustand";

import { getStaffPaymentBookings } from "../api/paymentApi";
import type { StaffPaymentBooking } from "../types/payment.types";

interface PaymentState {
  payments: StaffPaymentBooking[];
  loading: boolean;
  error: string;

  fetchPayments: () => Promise<void>;
  clearPayments: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  loading: false,
  error: "",

  fetchPayments: async () => {
    try {
      set({ loading: true, error: "" });

      const data = await getStaffPaymentBookings();

      set({
        payments: Array.isArray(data) ? data : [],
        loading: false,
        error: "",
      });
    } catch (error: any) {
      console.error("Payment store fetch error:", error);

      set({
        payments: [],
        loading: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Payment data fetch failed",
      });
    }
  },

  clearPayments: () => {
    set({
      payments: [],
      loading: false,
      error: "",
    });
  },
}));