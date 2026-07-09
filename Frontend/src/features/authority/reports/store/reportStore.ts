import { create } from "zustand";
import { getReportsSummaryApi } from "../api/reportApi";
import type { AuthorityReportsSummary } from "../types/report.types";

interface ReportState {
  reports: AuthorityReportsSummary | null;
  loading: boolean;
  error: string | null;
  fetchReportsSummary: (startDate?: string, endDate?: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: null,
  loading: false,
  error: null,
  fetchReportsSummary: async (startDate, endDate) => {
    try {
      set({ loading: true, error: null });
      const data = await getReportsSummaryApi(startDate, endDate);
      if (data.success) {
        set({ reports: data.reports, loading: false });
      } else {
        set({ error: "Failed to fetch reports", loading: false });
      }
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load reports summary",
      });
    }
  },
}));
