import { create } from "zustand";
import { getOwnerRoutes } from "@/features/owner/routes/api/routeApi";
import type { BoatRoute } from "../types/route.types";

type RouteStore = {
  routes: BoatRoute[];
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
};

export const useRouteStore = create<RouteStore>((set) => ({
  routes: [],
  loading: false,
  error: null,

  fetchRoutes: async () => {
    try {
      set({ loading: true, error: null });

      const routes = await getOwnerRoutes();

      set({ routes, loading: false });
    } catch (error: any) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to load routes",
      });
    }
  },
}));