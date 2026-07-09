import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckSquare,
  Trash2,
  Calendar,
  Volume2,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAdminNotificationsStore } from "../../notifications/store/notificationsStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

type TabType = "ALL" | "UNREAD" | "EMERGENCY" | "SYSTEM" | "BOOKING";

export default function NotificationDropdown({ open, onClose }: Props) {
  const {
    notifications,
    loading,
    fetchNotifications,
    markAllRead,
    markRead,
    removeNotification,
  } = useAdminNotificationsStore();

  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  if (!open) return null;

  // Filter logic
  const filtered = notifications.filter((n) => {
    if (activeTab === "UNREAD") return !n.isRead;
    if (activeTab === "EMERGENCY") return n.priority === "EMERGENCY";
    if (activeTab === "SYSTEM") return n.type === "SYSTEM";
    if (activeTab === "BOOKING") return n.type === "BOOKING" || n.type === "PAYMENT";
    return true;
  }).slice(0, 5); // display only top 5 in dropdown

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleViewAll = () => {
    onClose();
    navigate("/admin/notifications");
  };

  return (
    <div className="absolute right-12 top-16 w-96 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl z-50 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2.5">
        <h3 className="font-extrabold text-blue-950 text-sm flex items-center gap-1.5">
          <Bell size={16} className="text-blue-600" /> Notifications
          {unreadCount > 0 && (
            <span className="rounded bg-blue-100 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.5">
              {unreadCount} new
            </span>
          )}
        </h3>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <CheckSquare size={12} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2 mb-3 overflow-x-auto shrink-0 select-none">
        {(["ALL", "UNREAD", "EMERGENCY", "SYSTEM", "BOOKING"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase transition tracking-wider ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50 border border-slate-100"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs font-semibold text-slate-400">
            No {activeTab.toLowerCase()} notifications found.
          </div>
        ) : (
          filtered.map((n) => {
            const isEmergency = n.priority === "EMERGENCY";
            const isHigh = n.priority === "HIGH";
            return (
              <div
                key={n._id}
                className={`rounded-xl p-3 border transition flex justify-between gap-3 text-left ${
                  n.isRead
                    ? "bg-white border-slate-100"
                    : isEmergency
                    ? "bg-red-50/50 border-red-200"
                    : isHigh
                    ? "bg-amber-50/40 border-amber-200"
                    : "bg-blue-50/20 border-blue-100"
                }`}
              >
                <div className="flex gap-2">
                  <div className="mt-0.5 shrink-0">
                    {isEmergency ? (
                      <span className="h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-bounce">
                        <Volume2 size={12} />
                      </span>
                    ) : (
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        isHigh ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        <Info size={11} />
                      </span>
                    )}
                  </div>

                  <div>
                    <h5 className={`font-bold text-xs ${isEmergency ? "text-red-950" : "text-blue-950"}`}>
                      {n.title}
                      {isEmergency && <span className="ml-1 text-[8px] bg-red-600 text-white rounded px-1 uppercase font-black">ALERT</span>}
                    </h5>
                    <p className="text-slate-500 text-[10px] mt-1 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
                      <Calendar size={8} /> {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-end shrink-0">
                  <button
                    onClick={() => removeNotification(n._id)}
                    className="rounded-lg p-1 text-slate-300 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Delete Notification"
                  >
                    <Trash2 size={12} />
                  </button>

                  {!n.isRead && (
                    <button
                      onClick={() => markRead(n._id)}
                      className="text-[9px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Read
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Link */}
      <button
        onClick={handleViewAll}
        className="mt-3.5 w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold border border-slate-100 transition cursor-pointer group"
      >
        <span>View all notifications</span>
        <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-0.5 transition" />
      </button>

    </div>
  );
}