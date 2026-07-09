export type NotificationType =
  | "BOOKING"
  | "PAYMENT"
  | "SCHEDULE"
  | "ROUTE"
  | "SYSTEM"
  | "EMERGENCY"
  | "BOAT"
  | "PERMIT";

export type NotificationPriority = "LOW" | "HIGH" | "EMERGENCY";

export interface SystemNotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
  updatedAt: string;
}

export interface SendBroadcastPayload {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  userId?: string;
}
