import { create } from "zustand";
import { getReports } from "../api/reportApi";
import type { ReportDashboard } from "../types/report.types";

interface ReportState {
  report: ReportDashboard | null;
  loading: boolean;
  fetchReports: () => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  report: null,
  loading: false,

  fetchReports: async () => {
    try {
      set({ loading: true });

      const report = await getReports();

      set({
        report,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },
}));