import { create } from "zustand";
import { fetchDashboardStatsApi } from "../api/dashboardApi";

interface DashboardStats {
  totalBoats: number;
  verifiedBoats: number;
  pendingBoatVerification: number;
  rejectedBoats: number;
  suspendedBoats: number;
  pendingPermitRequests: number;
  approvedPermits: number;
  expiredPermits: number;
  pendingRouteApprovals: number;
  approvedRoutes: number;
  safetyInspectionsDue: number;
  activeComplaints: number;
  openViolations: number;
  emergencyAlerts: number;
  liveTrips: number;
  todayTripCount: number;
  inspectionsCount: number;
  pendingRefundRequests?: number;
  todaysRefundRequests?: number;
  approvedRefunds?: number;
  rejectedRefunds?: number;
  highValueRefunds?: number;
  refundQueue?: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  loading: false,
  error: null,
  fetchStats: async () => {
    try {
      set((state) => ({ loading: !state.stats, error: null }));
      const data = await fetchDashboardStatsApi();
      if (data.success) {
        set({ stats: data.stats, loading: false });
      } else {
        set({ error: "Failed to load dashboard statistics", loading: false });
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load stats",
      });
    }
  },
}));
