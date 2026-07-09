import API from "@/api/axiosInstance";
import type { StaffSchedule } from "../types/calendar.types";

export const getStaffSchedules = async (): Promise<StaffSchedule[]> => {
  const res = await API.get("/schedules/owner");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};