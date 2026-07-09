import { create } from "zustand";
import { getMySchedules } from "../api/scheduleApi";
import type { Schedule } from "@/features/owner/schedules/types/schedule.types";

type ScheduleStore = {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
};

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedules: [],
  loading: false,
  error: null,

  fetchSchedules: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getMySchedules();

      const schedules: Schedule[] = Array.isArray(res.data)
        ? res.data
        : res.data?.schedules || [];

      set({
        schedules,
        loading: false,
      });
    } catch (error: any) {
      set({
        schedules: [],
        loading: false,
        error:
          error?.response?.data?.message ||
          "Failed to load schedules",
      });
    }
  },
}));