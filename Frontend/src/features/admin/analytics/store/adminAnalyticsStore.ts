import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import type { AnalyticsResponse } from '@/features/admin/analytics/types';

interface AdminAnalyticsState {
  data: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
}

export const useAdminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get<AnalyticsResponse>('/reports/analytics');
      set({ data: res.data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load analytics', loading: false });
    }
  },
}));
