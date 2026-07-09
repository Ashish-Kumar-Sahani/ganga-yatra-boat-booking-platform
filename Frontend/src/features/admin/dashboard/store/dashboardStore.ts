import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";

interface DashboardState {
  data: any | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: (year?: number) => Promise<void>;
}

export const useAdminDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchDashboard: async (year?: number) => {
    set((state) => ({ loading: !state.data, error: null }));
    try {
      const url = year ? `/dashboard/admin?year=${year}` : "/dashboard/admin";
      const res = await axiosInstance.get<any>(url);
      const resData = res.data;
      if (resData && resData.success) {
        set({ data: resData, loading: false });
      } else {
        set({ error: resData?.message || "Failed to load dashboard", loading: false });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "An error occurred", loading: false });
    }
  },
}));
