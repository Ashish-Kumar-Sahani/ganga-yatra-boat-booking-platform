import { create } from "zustand";
import { getStaffSchedules } from "../api/calendarApi";
import type { StaffSchedule } from "../types/calendar.types";

interface CalendarState {
  schedules: StaffSchedule[];
  loading: boolean;
  fetchSchedules: () => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  schedules: [],
  loading: false,

  fetchSchedules: async () => {
    set({ loading: true });
    try {
      const data = await getStaffSchedules();
      set({
        schedules: data,
        loading: false,
      });
    } catch {
      set({
        loading: false,
      });
    }
  },
}));