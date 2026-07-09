import type { ManagerNotification } from "../types/notification.types";
import { useNotificationStore } from "../store/notificationStore";
import { Check, CheckCircle2, Bell } from "lucide-react";

interface Props {
  notifications: ManagerNotification[];
}

export default function NotificationList({ notifications }: Props) {
  const { markRead, markAllRead } = useNotificationStore();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center text-slate-400 font-semibold shadow flex flex-col items-center justify-center gap-3">
        <Bell size={48} className="text-slate-300" />
        No notifications found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition-all"
          >
            <CheckCircle2 size={14} />
            Mark All as Read
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden divide-y divide-slate-100">
        {notifications.map((item) => (
          <div
            key={item._id}
            className={`flex items-center justify-between p-5 transition-colors ${
              item.isRead ? "bg-white" : "bg-blue-50/20"
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                {!item.isRead && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.message}</p>
            </div>

            {!item.isRead && (
              <button
                onClick={() => markRead(item._id)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 px-3 py-1.5 rounded-xl transition-all"
              >
                <Check size={14} />
                Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}