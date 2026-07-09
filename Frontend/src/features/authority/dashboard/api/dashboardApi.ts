import axiosInstance from "@/api/axiosInstance";

export const fetchDashboardStatsApi = async () => {
  const res = await axiosInstance.get("/authority/dashboard/stats");
  return res.data;
};
