import { create } from "zustand";

import { getOwnerDashboard } from "../api/ownerApi";

import type {
  OwnerDashboardData,
} from "../types/owner.types";

type OwnerStore = {
  dashboard: OwnerDashboardData | null;

  loading: boolean;

  error: string | null;

  fetchDashboard: () => Promise<void>;
};

export const useOwnerStore =
  create<OwnerStore>((set) => ({
    dashboard: null,

    loading: false,

    error: null,

    fetchDashboard: async () => {
      try {
        set((state) => ({
          loading: !state.dashboard,
          error: null,
        }));

        const dashboard =
          await getOwnerDashboard();

        set({
          dashboard,
          loading: false,
        });
      } catch (error: any) {
        set({
          loading: false,
          error:
            error?.response?.data?.message ||
            "Dashboard Load Failed",
        });
      }
    },
  }));