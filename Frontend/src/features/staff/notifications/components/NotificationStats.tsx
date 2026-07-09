import type {
  ManagerNotification,
} from "../types/notification.types";

interface Props {
  notifications: ManagerNotification[];
}

export default function NotificationStats({
  notifications,
}: Props) {
  const unread =
    notifications.filter(
      (n) => !n.isRead
    ).length;

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="bg-white p-5 rounded-2xl shadow">
        <h3>Total Notifications</h3>

        <p className="text-3xl font-bold">
          {notifications.length}
        </p>
      </div>

      <div className="bg-red-50 p-5 rounded-2xl">
        <h3>Unread</h3>

        <p className="text-3xl font-bold">
          {unread}
        </p>
      </div>
    </div>
  );
}