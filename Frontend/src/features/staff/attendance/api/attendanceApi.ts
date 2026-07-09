import axiosInstance from "../../../../api/axiosInstance";
import type { AttendanceRecord } from "../types/attendance.types";

export const getAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  const res = await axiosInstance.get("/attendance/owner");
  return res.data;
};