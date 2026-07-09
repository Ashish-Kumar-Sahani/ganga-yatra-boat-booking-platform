import { create } from "zustand";
import { 
  getAllBookingsAdmin, 
  updateBookingStatusAdmin,
  getPendingRefundsAdmin,
  approveRefundAdmin,
  rejectRefundAdmin,
  getCancellationLogsAdmin,
  getRefundLogsAdmin
} from "../api/bookingsApi";

interface BookingsState {
  bookings: any[];
  pendingRefunds: any[];
  cancellationLogs: any[];
  refundLogs: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  fetchBookings: (params?: any) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<boolean>;
  fetchPendingRefunds: () => Promise<void>;
  approveRefund: (id: string, payload?: any) => Promise<boolean>;
  rejectRefund: (id: string, reason: string) => Promise<boolean>;
  fetchCancellationLogs: () => Promise<void>;
  fetchRefundLogs: () => Promise<void>;
}

export const useAdminBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  pendingRefunds: [],
  cancellationLogs: [],
  refundLogs: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  },
  loading: false,
  error: null,

  fetchBookings: async (params) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllBookingsAdmin(params);
      if (res.success) {
        set({
          bookings: res.bookings,
          pagination: res.pagination,
          loading: false,
        });
      } else {
        set({ error: res.message || "Failed to fetch bookings", loading: false });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch bookings", loading: false });
    }
  },

  updateStatus: async (id, status) => {
    try {
      await updateBookingStatusAdmin(id, status);
      const updated = get().bookings.map((b) => (b._id === id ? { ...b, bookingStatus: status } : b));
      set({ bookings: updated });
      return true;
    } catch (err) {
      return false;
    }
  },

  fetchPendingRefunds: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getPendingRefundsAdmin();
      set({ pendingRefunds: res.refunds || [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch refunds", loading: false });
    }
  },

  approveRefund: async (id, payload) => {
    try {
      await approveRefundAdmin(id, payload);
      const res = await getPendingRefundsAdmin();
      set({ pendingRefunds: res.refunds || [] });
      return true;
    } catch (err) {
      return false;
    }
  },

  rejectRefund: async (id, reason) => {
    try {
      await rejectRefundAdmin(id, reason);
      const updated = get().pendingRefunds.filter((r) => r._id !== id);
      set({ pendingRefunds: updated });
      return true;
    } catch (err) {
      return false;
    }
  },

  fetchCancellationLogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getCancellationLogsAdmin();
      set({ cancellationLogs: res.logs || [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch cancellation logs", loading: false });
    }
  },

  fetchRefundLogs: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getRefundLogsAdmin();
      set({ refundLogs: res.logs || [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch refund logs", loading: false });
    }
  },
}));
