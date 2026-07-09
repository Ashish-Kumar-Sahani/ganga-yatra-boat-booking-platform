import { create } from "zustand";
import {
  getBoatsApi,
  getBoatByIdApi,
  approveBoatApi,
  rejectBoatApi,
  suspendBoatApi,
} from "../api/boatApi";
import type { Boat } from "../types/boat.types";

interface BoatState {
  boats: Boat[];
  selectedBoat: Boat | null;
  loading: boolean;
  error: string | null;
  fetchBoats: (status?: string, search?: string) => Promise<void>;
  fetchBoatById: (id: string) => Promise<void>;
  approveBoat: (id: string, reviewNote?: string) => Promise<boolean>;
  rejectBoat: (id: string, rejectionReason: string, reviewNote?: string) => Promise<boolean>;
  suspendBoat: (id: string, suspendedReason: string, reviewNote?: string) => Promise<boolean>;
}

export const useBoatVerificationStore = create<BoatState>((set) => ({
  boats: [],
  selectedBoat: null,
  loading: false,
  error: null,
  fetchBoats: async (status, search) => {
    try {
      set({ loading: true, error: null });
      const boats = await getBoatsApi(status, search);
      set({ boats, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load boats",
      });
    }
  },
  fetchBoatById: async (id) => {
    try {
      set({ loading: true, error: null, selectedBoat: null });
      const boat = await getBoatByIdApi(id);
      set({ selectedBoat: boat, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load boat details",
      });
    }
  },
  approveBoat: async (id, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await approveBoatApi(id, reviewNote);
      set((state) => ({
        boats: state.boats.map((b) => (b._id === id ? res.boat : b)),
        selectedBoat: state.selectedBoat?._id === id ? res.boat : state.selectedBoat,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to approve boat",
      });
      return false;
    }
  },
  rejectBoat: async (id, rejectionReason, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await rejectBoatApi(id, rejectionReason, reviewNote);
      set((state) => ({
        boats: state.boats.map((b) => (b._id === id ? res.boat : b)),
        selectedBoat: state.selectedBoat?._id === id ? res.boat : state.selectedBoat,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to reject boat",
      });
      return false;
    }
  },
  suspendBoat: async (id, suspendedReason, reviewNote) => {
    try {
      set({ loading: true, error: null });
      const res = await suspendBoatApi(id, suspendedReason, reviewNote);
      set((state) => ({
        boats: state.boats.map((b) => (b._id === id ? res.boat : b)),
        selectedBoat: state.selectedBoat?._id === id ? res.boat : state.selectedBoat,
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to suspend boat",
      });
      return false;
    }
  },
}));
