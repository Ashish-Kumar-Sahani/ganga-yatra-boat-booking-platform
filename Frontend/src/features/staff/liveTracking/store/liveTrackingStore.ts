import { create } from "zustand";
import { getStaffLiveTrips } from "../api/liveTrackingApi";
import type { LiveTrip } from "../types/liveTracking.types";

interface LiveTrackingState {
  boats: LiveTrip[];
  loading: boolean;
  fetchLiveBoats: () => Promise<void>;
}

export const useLiveTrackingStore = create<LiveTrackingState>((set) => ({
  boats: [],
  loading: false,

  fetchLiveBoats: async () => {
    set({ loading: true });
    try {
      const boats = await getStaffLiveTrips();
      set({
        boats,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },
}));