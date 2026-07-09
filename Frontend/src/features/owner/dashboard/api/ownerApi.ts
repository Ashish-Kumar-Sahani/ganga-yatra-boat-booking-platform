import API from "@/api/axiosInstance";

export const getOwnerDashboard = async () => {
  const res = await API.get(
    "/dashboard/owner"
  );

  return res.data;
};

export const getOwnerBookings = async () => {
  const res = await API.get("/bookings/owner");
  return res.data;
};

export const getOwnerReports = async (params?: { year?: number; month?: number }) => {
  const res = await API.get("/reports/owner", { params });
  return res.data;
};
