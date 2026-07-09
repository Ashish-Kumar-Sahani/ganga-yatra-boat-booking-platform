import { create } from "zustand";
import { getAttendanceRecords } from "../api/attendanceApi";
import type { AttendanceRecord } from "../types/attendance.types";

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  fetchAttendance: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  loading: false,

  fetchAttendance: async () => {
    try {
      set({ loading: true });
      const records = await getAttendanceRecords();
      set({ records, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));