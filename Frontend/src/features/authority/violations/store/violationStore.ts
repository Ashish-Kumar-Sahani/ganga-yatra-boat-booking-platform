import { create } from "zustand";
import {
  getViolationsApi,
  createViolationApi,
  updateViolationStatusApi,
  updateViolationPenaltyApi,
} from "../api/violationApi";
import type { Violation } from "../types/violation.types";

interface ViolationState {
  violations: Violation[];
  loading: boolean;
  error: string | null;
  fetchViolations: () => Promise<void>;
  createViolation: (payload: any) => Promise<boolean>;
  updateViolationStatus: (id: string, status: string, resolutionNotes?: string) => Promise<boolean>;
  updateViolationPenalty: (id: string, payload: { penaltyAmount?: number; penaltyPaid?: boolean }) => Promise<boolean>;
}

export const useViolationStore = create<ViolationState>((set) => ({
  violations: [],
  loading: false,
  error: null,
  fetchViolations: async () => {
    try {
      set({ loading: true, error: null });
      const violations = await getViolationsApi();
      set({ violations, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load violations",
      });
    }
  },
  createViolation: async (payload) => {
    try {
      set({ loading: true, error: null });
      const res = await createViolationApi(payload);
      set((state) => ({
        violations: [res.violation, ...state.violations],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to issue violation penalty",
      });
      return false;
    }
  },
  updateViolationStatus: async (id, status, resolutionNotes) => {
    try {
      set({ loading: true, error: null });
      const res = await updateViolationStatusApi(id, status, resolutionNotes);
      set((state) => ({
        violations: state.violations.map((v) => (v._id === id ? res.violation : v)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update violation status",
      });
      return false;
    }
  },
  updateViolationPenalty: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const res = await updateViolationPenaltyApi(id, payload);
      set((state) => ({
        violations: state.violations.map((v) => (v._id === id ? res.violation : v)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update violation penalty",
      });
      return false;
    }
  },
}));
