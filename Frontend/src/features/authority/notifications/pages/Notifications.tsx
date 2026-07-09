import { useEffect } from "react";
import { useNotificationStore } from "../store/notificationStore";
import {
  Bell,
  Check,
  CheckCheck,
  Info,
  AlertTriangle,
  Flame,
  Clock,
} from "lucide-react";

export default function Notifications() {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    const ok = await markAllAsRead();
    if (ok) {
      alert("All alerts marked as read.");
      fetchNotifications();
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "EMERGENCY":
        return (
          <div className="rounded-xl bg-red-100 p-2.5 text-red-700 animate-bounce">
            <Flame size={20} />
          </div>
        );
      case "HIGH":
        return (
          <div className="rounded-xl bg-orange-100 p-2.5 text-orange-700">
            <AlertTriangle size={20} />
          </div>
        );
      default:
        return (
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
            <Info size={20} />
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "EMERGENCY") return "border-l-4 border-l-red-500 bg-red-50/10";
    if (priority === "HIGH") return "border-l-4 border-l-orange-500 bg-orange-50/10";
    return "border-l-4 border-l-blue-500";
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-blue-950 flex items-center gap-2">
            <Bell size={28} className="text-blue-600" /> Notifications & Alerts
          </h1>
          <p className="text-slate-500">
            Receive and track regulatory notifications, permit updates, and emergency broadcasts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 text-xs font-bold text-blue-700 transition"
          >
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Notification Count Alert */}
      {unreadCount > 0 && (
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 font-bold text-blue-800 text-xs">
          You have {unreadCount} unread official alerts requiring verification or checking.
        </div>
      )}

      {/* List */}
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {loading && notifications.length === 0 ? (
        <div className="py-20 text-center font-bold text-slate-500">Retrieving official alerts inbox...</div>
      ) : notifications.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-blue-950">Alerts inbox clean</h2>
          <p className="mt-2 text-slate-500">You do not have any new compliance alerts or notifications.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition duration-300 flex items-start gap-4 ${getPriorityColor(
                n.priority
              )} ${n.isRead ? "opacity-75" : "ring-1 ring-blue-100"}`}
            >
              {getPriorityIcon(n.priority)}

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <h4 className={`text-sm font-black text-blue-950 truncate ${!n.isRead ? "font-black" : "font-bold"}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.message}</p>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => handleMarkSingleRead(n._id)}
                  className="rounded-lg bg-blue-50 hover:bg-blue-100 p-2 text-blue-600 transition shrink-0"
                  title="Mark as read"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
