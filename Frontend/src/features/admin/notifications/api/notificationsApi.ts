import axiosInstance from "@/api/axiosInstance";

export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/notifications/my-notifications");
  return response.data;
};

export const createAdminNotification = async (data: any) => {
  const response = await axiosInstance.post("/notifications", data);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axiosInstance.patch("/notifications/read-all");
  return response.data;
};

export const markSingleNotificationRead = async (id: string) => {
  const response = await axiosInstance.patch(`/notifications/${id}/read`);
  return response.data;
};

export const deleteSingleNotification = async (id: string) => {
  const response = await axiosInstance.delete(`/notifications/${id}`);
  return response.data;
};
