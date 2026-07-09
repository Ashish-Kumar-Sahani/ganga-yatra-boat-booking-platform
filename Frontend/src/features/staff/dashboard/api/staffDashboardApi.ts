import axiosInstance from "../../../../api/axiosInstance";
import type { StaffDashboardData } from "../types/staff.types";

export const getStaffDashboard = async (): Promise<StaffDashboardData> => {
  const res = await axiosInstance.get("/staff/dashboard");
  return res.data;
};