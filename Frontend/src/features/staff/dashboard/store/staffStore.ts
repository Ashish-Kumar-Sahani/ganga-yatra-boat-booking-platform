import { create } from "zustand";
import { getStaffDashboard } from "../api/staffDashboardApi";
import type { StaffDashboardData } from "../types/staff.types";

interface ManagerState {
  data: StaffDashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useManagerStore = create<ManagerState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set((state) => ({ loading: !state.data, error: null }));
      const data = await getStaffDashboard();
      set({ data, loading: false });
    } catch {
      set({
        data: null,
        loading: false,
        error: "Dashboard data load failed",
      });
    }
  },
}));