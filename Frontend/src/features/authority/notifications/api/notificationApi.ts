import axiosInstance from "@/api/axiosInstance";

export const fetchNotificationsApi = async () => {
  const res = await axiosInstance.get("/notifications/my-notifications");
  return res.data;
};

export const markNotificationReadApi = async (id: string) => {
  const res = await axiosInstance.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsReadApi = async () => {
  const res = await axiosInstance.patch("/notifications/mark-all-read");
  return res.data;
};
