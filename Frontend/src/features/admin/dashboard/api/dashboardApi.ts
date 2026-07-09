import axiosInstance from "@/api/axiosInstance";

export const getAdminDashboardData = async () => {
  const response = await axiosInstance.get("/dashboard/admin");
  return response.data;
};
