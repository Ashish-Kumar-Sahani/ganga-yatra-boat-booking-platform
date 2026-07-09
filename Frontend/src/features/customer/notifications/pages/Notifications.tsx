import { useEffect } from "react";
import { Bell, CheckCheck, ShieldAlert, CreditCard, Ship, Calendar } from "lucide-react";
import { useCustomerStore } from "../../store/customerStore";

export default function Notifications() {
  const {
    notifications,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    loadingNotifications,
  } = useCustomerStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Calendar size={18} className="text-blue-600" />;
      case "PAYMENT":
        return <CreditCard size={18} className="text-green-600" />;
      case "SCHEDULE":
        return <Ship size={18} className="text-orange-600" />;
      case "EMERGENCY":
        return <ShieldAlert size={18} className="text-red-600 animate-bounce" />;
      default:
        return <Bell size={18} className="text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Stay updated with ride notices, transactions statements, and emergency alerts
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex w-fit items-center gap-2 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-100/30 px-4 py-2.5 text-xs font-bold text-blue-700 dark:text-blue-400"
          >
            <CheckCheck size={16} />
            Mark all read
          </button>
        )}
      </header>

      {loadingNotifications && (
        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 font-bold">Loading notices...</p>
        </div>
      )}

      {!loadingNotifications && notifications.length === 0 && (
        <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-12 text-center shadow-sm max-w-lg mx-auto">
          <Bell size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">No new alerts</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            You're all caught up! Booking confirmations and receipt statements will appear here.
          </p>
        </div>
      )}

      {!loadingNotifications && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                if (!item.isRead) markNotificationRead(item._id);
              }}
              className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all cursor-pointer ${
                item.isRead
                  ? "bg-white dark:bg-slate-800/60 border-slate-100 dark:border-slate-700/50"
                  : "bg-blue-50/40 dark:bg-blue-900/10 border-blue-200/50 shadow-sm"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`rounded-xl p-2.5 ${
                    item.isRead
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-400"
                      : "bg-blue-100/50 dark:bg-blue-950/40 text-blue-600"
                  }`}
                >
                  {getIcon(item.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {item.message}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 mt-2">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
