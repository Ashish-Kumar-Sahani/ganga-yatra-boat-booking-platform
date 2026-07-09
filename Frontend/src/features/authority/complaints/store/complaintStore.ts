import { create } from "zustand";
import {
  getComplaintsApi,
  updateComplaintStatusApi,
  updateComplaintNoteApi,
} from "../api/complaintApi";
import type { Complaint } from "../types/complaint.types";

interface ComplaintState {
  complaints: Complaint[];
  loading: boolean;
  error: string | null;
  fetchComplaints: () => Promise<void>;
  updateComplaintStatus: (id: string, status: string, authorityNote?: string) => Promise<boolean>;
  updateComplaintNote: (id: string, payload: { authorityNote: string; linkedViolationId?: string | null }) => Promise<boolean>;
}

export const useComplaintStore = create<ComplaintState>((set) => ({
  complaints: [],
  loading: false,
  error: null,
  fetchComplaints: async () => {
    try {
      set({ loading: true, error: null });
      const complaints = await getComplaintsApi();
      set({ complaints, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to load complaints",
      });
    }
  },
  updateComplaintStatus: async (id, status, authorityNote) => {
    try {
      set({ loading: true, error: null });
      const res = await updateComplaintStatusApi(id, status, authorityNote);
      set((state) => ({
        complaints: state.complaints.map((c) => (c._id === id ? res.complaint : c)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update complaint status",
      });
      return false;
    }
  },
  updateComplaintNote: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      const res = await updateComplaintNoteApi(id, payload);
      set((state) => ({
        complaints: state.complaints.map((c) => (c._id === id ? res.complaint : c)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update complaint note",
      });
      return false;
    }
  },
}));
