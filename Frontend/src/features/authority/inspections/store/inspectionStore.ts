import { create } from "zustand";
import {
  getInspectionsApi,
  getInspectionByIdApi,
  createInspectionApi,
  updateInspectionResultApi,
} from "../api/inspectionApi";
import type { Inspection } from "../types/inspection.types";

interface InspectionState {
  inspections: Inspection[];
  selectedInspection: Inspection | null;
  loading: boolean;
  error: string | null;
  fetchInspections: () => Promise<void>;
  fetchInspectionById: (id: string) => Promise<void>;
  createInspection: (payload: any) => Promise<boolean>;
  updateInspectionResult: (id: string, result: string, remarks?: string) => Promise<boolean>;
}

export const useInspectionStore = create<InspectionState>((set) => ({
  inspections: [],
  selectedInspection: null,
  loading: false,
  error: null,
  fetchInspections: async () => {
    try {
      set({ loading: true, error: null });
      const inspections = await getInspectionsApi();
      set({ inspections, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load inspections",
      });
    }
  },
  fetchInspectionById: async (id) => {
    try {
      set({ loading: true, error: null, selectedInspection: null });
      const inspection = await getInspectionByIdApi(id);
      set({ selectedInspection: inspection, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load inspection details",
      });
    }
  },
  createInspection: async (payload) => {
    try {
      set({ loading: true, error: null });
      await createInspectionApi(payload);
      set({ loading: false });
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to log inspection",
      });
      return false;
    }
  },
  updateInspectionResult: async (id, result, remarks) => {
    try {
      set({ loading: true, error: null });
      const res = await updateInspectionResultApi(id, result, remarks);
      set((state) => ({
        inspections: state.inspections.map((i) => (i._id === id ? res.inspection : i)),
        selectedInspection: state.selectedInspection?._id === id ? res.inspection : state.selectedInspection,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update inspection result",
      });
      return false;
    }
  },
}));
