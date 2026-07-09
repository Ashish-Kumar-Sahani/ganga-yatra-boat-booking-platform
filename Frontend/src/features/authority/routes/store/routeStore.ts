import { create } from "zustand";
import {
  getRoutesApi,
  getRouteByIdApi,
  approveRouteApi,
  rejectRouteApi,
  suspendRouteApi,
} from "../api/routeApi";
import type { Route } from "../types/route.types";

interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
  fetchRoutes: (status?: string) => Promise<void>;
  fetchRouteById: (id: string) => Promise<void>;
  approveRoute: (id: string, payload: { approvalNote?: string; safetyNote?: string }) => Promise<boolean>;
  rejectRoute: (id: string, rejectionReason: string, approvalNote?: string) => Promise<boolean>;
  suspendRoute: (id: string, suspendedReason: string, approvalNote?: string) => Promise<boolean>;
}

export const useRouteApprovalStore = create<RouteState>((set) => ({
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,
  fetchRoutes: async (status) => {
    try {
      set({ loading: true, error: null });
      const routes = await getRoutesApi(status);
      set({ routes, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load routes",
      });
    }
  },
  fetchRouteById: async (id) => {
    try {
      set({ loading: true, error: null, selectedRoute: null });
      const route = await getRouteByIdApi(id);
      set({ selectedRoute: route, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load route details",
      });
    }
  },
  approveRoute: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const res = await approveRouteApi(id, payload);
      set((state) => ({
        routes: state.routes.map((r) => (r._id === id ? res.route : r)),
        selectedRoute: state.selectedRoute?._id === id ? res.route : state.selectedRoute,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to approve route",
      });
      return false;
    }
  },
  rejectRoute: async (id, rejectionReason, approvalNote) => {
    try {
      set({ loading: true, error: null });
      const res = await rejectRouteApi(id, rejectionReason, approvalNote);
      set((state) => ({
        routes: state.routes.map((r) => (r._id === id ? res.route : r)),
        selectedRoute: state.selectedRoute?._id === id ? res.route : state.selectedRoute,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to reject route",
      });
      return false;
    }
  },
  suspendRoute: async (id, suspendedReason, approvalNote) => {
    try {
      set({ loading: true, error: null });
      const res = await suspendRouteApi(id, suspendedReason, approvalNote);
      set((state) => ({
        routes: state.routes.map((r) => (r._id === id ? res.route : r)),
        selectedRoute: state.selectedRoute?._id === id ? res.route : state.selectedRoute,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to suspend route",
      });
      return false;
    }
  },
}));
