import axiosInstance from "../../../../api/axiosInstance";
import type { ManagerNotification } from "../types/notification.types";

export const getNotifications = async (): Promise<ManagerNotification[]> => {
  const res = await axiosInstance.get("/notifications/my-notifications");
  return res.data;
};

export const markNotificationRead = async (id: string): Promise<any> => {
  const res = await axiosInstance.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async (): Promise<any> => {
  const res = await axiosInstance.patch("/notifications/mark-all-read");
  return res.data;
};