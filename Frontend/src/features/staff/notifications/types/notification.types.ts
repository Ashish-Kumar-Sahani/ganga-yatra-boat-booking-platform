export interface ManagerNotification {
  _id: string;

  title: string;

  message: string;

  type:
    | "BOOKING"
    | "PAYMENT"
    | "BOAT"
    | "SYSTEM";

  isRead: boolean;

  createdAt: string;
}