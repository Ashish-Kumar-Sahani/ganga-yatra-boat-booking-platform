import { create } from "zustand";
import {
  getPermitsApi,
  getPermitByIdApi,
  approvePermitApi,
  rejectPermitApi,
  suspendPermitApi,
  renewalRequiredPermitApi,
} from "../api/permitApi";
import type { Permit } from "../types/permit.types";

interface PermitState {
  permits: Permit[];
  selectedPermit: Permit | null;
  loading: boolean;
  error: string | null;
  fetchPermits: (status?: string, type?: string) => Promise<void>;
  fetchPermitById: (id: string) => Promise<void>;
  approvePermit: (
    id: string,
    payload: { reviewNote?: string; validFrom?: string; validTill?: string }
  ) => Promise<boolean>;
  rejectPermit: (id: string, rejectionReason: string, reviewNote?: string) => Promise<boolean>;
  suspendPermit: (id: string, suspendedReason: string, reviewNote?: string) => Promise<boolean>;
  markRenewalRequired: (id: string, reviewNote?: string) => Promise<boolean>;
}

export const usePermitApprovalStore = create<PermitState>((set) => ({
  permits: [],
  selectedPermit: null,
  loading: false,
  error: null,
  fetchPermits: async (status, type) => {
    try {
      set({ loading: true, error: null });
      const permits = await getPermitsApi(status, type);
      set({ permits, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load permits",
      });
    }
  },
  fetchPermitById: async (id) => {
    try {
      set({ loading: true, error: null, selectedPermit: null });
      const permit = await getPermitByIdApi(id);
      set({ selectedPermit: permit, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load permit details",
      });
    }
  },
  approvePermit: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const res = await approvePermitApi(id, payload);
      set((state) => ({
        permits: state.permits.map((p) => (p._id === id ? res.permit : p)),
        selectedPermit: state.selectedPermit?._id === id ? res.permit : state.selectedPermit,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to approve permit",
      });
      return false;
    }
  },
  rejectPermit: async (id, rejectionReason, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await rejectPermitApi(id, rejectionReason, reviewNote);
      set((state) => ({
        permits: state.permits.map((p) => (p._id === id ? res.permit : p)),
        selectedPermit: state.selectedPermit?._id === id ? res.permit : state.selectedPermit,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to reject permit",
      });
      return false;
    }
  },
  suspendPermit: async (id, suspendedReason, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await suspendPermitApi(id, suspendedReason, reviewNote);
      set((state) => ({
        permits: state.permits.map((p) => (p._id === id ? res.permit : p)),
        selectedPermit: state.selectedPermit?._id === id ? res.permit : state.selectedPermit,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to suspend permit",
      });
      return false;
    }
  },
  markRenewalRequired: async (id, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await renewalRequiredPermitApi(id, reviewNote);
      set((state) => ({
        permits: state.permits.map((p) => (p._id === id ? res.permit : p)),
        selectedPermit: state.selectedPermit?._id === id ? res.permit : state.selectedPermit,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to mark renewal required",
      });
      return false;
    }
  },
}));
