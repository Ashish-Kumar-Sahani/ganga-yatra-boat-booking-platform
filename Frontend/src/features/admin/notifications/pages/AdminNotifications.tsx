import { useEffect, useState } from "react";
import { Bell, Send, CheckSquare, Trash2, Calendar, Volume2 } from "lucide-react";
import { useAdminNotificationsStore } from "../store/notificationsStore";
import { useAdminUsersStore } from "../../users/store/usersStore";

export default function AdminNotifications() {
  const { notifications, loading, fetchNotifications, broadcastNotification, markAllRead, markRead, removeNotification } = useAdminNotificationsStore();
  const { users: allUsers, fetchUsers } = useAdminUsersStore();

  const [form, setForm] = useState({
    userId: "",
    title: "",
    message: "",
    priority: "LOW",
    type: "SYSTEM",
  });

  const [broadcastTarget, setBroadcastTarget] = useState("ALL");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchUsers({ limit: 1000 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    const payload: any = {
      title: form.title,
      message: form.message,
      priority: form.priority,
      type: form.type,
    };

    if (broadcastTarget === "INDIVIDUAL") {
      if (!form.userId) {
        alert("Please select a target user.");
        return;
      }
      payload.userId = form.userId;
      const ok = await broadcastNotification(payload);
      if (ok) {
        setSuccessMsg("Individual notification sent successfully!");
        setForm({ ...form, title: "", message: "", userId: "" });
      }
    } else {
      const alertTargets = allUsers.map((u) => u._id);
      let successes = 0;
      for (const targetId of alertTargets) {
        const ok = await broadcastNotification({ ...payload, userId: targetId });
        if (ok) successes++;
      }
      setSuccessMsg(`Broadcasted notification to ${successes} active users!`);
      setForm({ ...form, title: "", message: "" });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950 font-sans">Notification Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Send global broadcasts, configure emergency priorities, and audit system logs.</p>
        </div>

        <button
          onClick={markAllRead}
          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-sm transition cursor-pointer"
        >
          <CheckSquare size={16} /> Mark All Read
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2">
              <Bell size={20} className="text-blue-600" /> Notifications Feed ({unreadCount} unread)
            </h2>
          </div>

          <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-white shadow-sm border border-slate-100"></div>
              ))
            ) : notifications.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center border border-slate-100 text-slate-500 font-medium">
                No alerts found in feed.
              </div>
            ) : (
              notifications.map((n) => {
                const isEmergency = n.priority === "EMERGENCY";
                const isHigh = n.priority === "HIGH";
                return (
                  <div
                    key={n._id}
                    className={`rounded-2xl p-5 shadow-sm border transition flex justify-between gap-4 ${
                      n.isRead 
                        ? "bg-white border-slate-100" 
                        : isEmergency 
                        ? "bg-red-50/50 border-red-200 shadow-md ring-1 ring-red-300 animate-pulse-slow"
                        : isHigh
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-blue-50/20 border-blue-100"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {isEmergency ? (
                          <div className="h-7 w-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-bounce">
                            <Volume2 size={16} />
                          </div>
                        ) : (
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center ${
                            isHigh ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                          }`}>
                            <Bell size={14} />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className={`font-bold ${isEmergency ? "text-red-950 text-base" : "text-blue-950 text-sm"}`}>
                          {n.title}
                          {isEmergency && <span className="ml-2 rounded bg-red-600 text-white text-[9px] px-1.5 py-0.5 font-extrabold uppercase">EMERGENCY</span>}
                          {isHigh && <span className="ml-2 rounded bg-amber-500 text-white text-[9px] px-1.5 py-0.5 font-extrabold uppercase">URGENT</span>}
                        </h4>
                        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2.5 flex items-center gap-1">
                          <Calendar size={10} /> {new Date(n.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0">
                      <button
                        onClick={() => removeNotification(n._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Alert"
                      >
                        <Trash2 size={16} />
                      </button>

                      {!n.isRead && (
                        <button
                          onClick={() => markRead(n._id)}
                          className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Send Broadcast Form */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3 mb-4">
            <Send size={18} className="text-blue-600" /> Push Notification
          </h2>

          {successMsg && (
            <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-xs font-semibold border border-green-200">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Broadcast Target</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastTarget("ALL")}
                  className={`rounded-xl py-2 px-3 text-xs font-bold border transition cursor-pointer ${
                    broadcastTarget === "ALL"
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  All Users
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastTarget("INDIVIDUAL")}
                  className={`rounded-xl py-2 px-3 text-xs font-bold border transition cursor-pointer ${
                    broadcastTarget === "INDIVIDUAL"
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Specific User
                </button>
              </div>
            </div>

            {broadcastTarget === "INDIVIDUAL" && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Select User</label>
                <select
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:border-blue-500 outline-none cursor-pointer"
                  required
                >
                  <option value="">Choose individual...</option>
                  {allUsers.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name} ({u.role} - {u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Priority Level</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="LOW">LOW</option>
                <option value="HIGH">HIGH</option>
                <option value="EMERGENCY">EMERGENCY</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Notification Title</label>
              <input
                type="text"
                placeholder="Alert title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-xs focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Message Content</label>
              <textarea
                placeholder="Write your push text here..."
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-xs focus:border-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold shadow transition cursor-pointer"
            >
              <Send size={14} /> Send Broadcast
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
