import { create } from "zustand";
import type { Route } from "../types/route.types";
import {
  getRoutes,
  getRoutesByCity,
  createRoute,
  updateRoute,
  deleteRoute,
  approveRoute,
  rejectRoute,
} from "../api/routeApi";

interface RouteStore {
  routes: Route[];
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  fetchRoutesByCity: (cityId: string) => Promise<void>;
  addRoute: (routeData: Partial<Route>) => Promise<boolean>;
  editRoute: (id: string, routeData: Partial<Route>) => Promise<boolean>;
  removeRoute: (id: string) => Promise<boolean>;
  approve: (id: string) => Promise<boolean>;
  reject: (id: string) => Promise<boolean>;
}

export const useRouteStore = create<RouteStore>((set, get) => ({
  routes: [],
  loading: false,
  error: null,

  fetchRoutes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRoutes();
      set({ routes: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch routes", loading: false });
    }
  },

  fetchRoutesByCity: async (cityId) => {
    set({ loading: true, error: null });
    try {
      const data = await getRoutesByCity(cityId);
      set({ routes: Array.isArray(data) ? data : [], loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to fetch city routes", loading: false });
    }
  },

  addRoute: async (routeData) => {
    set({ loading: true, error: null });
    try {
      await createRoute(routeData);
      await get().fetchRoutes(); // Refetch to populate cityId, sourceGhatId, destinationGhatId
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to add route", loading: false });
      return false;
    }
  },

  editRoute: async (id, routeData) => {
    set({ loading: true, error: null });
    try {
      await updateRoute(id, routeData);
      await get().fetchRoutes(); // Refetch to populate cityId, sourceGhatId, destinationGhatId
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to update route", loading: false });
      return false;
    }
  },

  removeRoute: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteRoute(id);
      set({
        routes: get().routes.filter((r) => r._id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to delete route", loading: false });
      return false;
    }
  },

  approve: async (id) => {
    set({ loading: true, error: null });
    try {
      const updated = await approveRoute(id);
      set({
        routes: get().routes.map((r) => (r._id === id ? { ...r, approvalStatus: "APPROVED", isActive: true } : r)),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to approve route", loading: false });
      return false;
    }
  },

  reject: async (id) => {
    set({ loading: true, error: null });
    try {
      const updated = await rejectRoute(id);
      set({
        routes: get().routes.map((r) => (r._id === id ? { ...r, approvalStatus: "REJECTED", isActive: false } : r)),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "Failed to reject route", loading: false });
      return false;
    }
  },
}));
