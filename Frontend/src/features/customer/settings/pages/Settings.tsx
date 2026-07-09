import { useState } from "react";
import { Sun, Moon, Laptop, Bell, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import { useCustomerStore } from "../../store/customerStore";
import API from "@/api/axiosInstance";

export default function CustomerSettings() {
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    notificationPreferences,
    setNotificationPreferences,
  } = useCustomerStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccessMsg(res.data?.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to change password. Please check your current password.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize your preferences, UI styling, and security profile
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Theme and language selection */}
        <div className="space-y-6">
          {/* Theme Card */}
          <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sun size={20} className="text-blue-600" />
              Theme Appearance
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 mb-5">
              Toggle dashboard skin to match your preference
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-bold transition-all ${
                  theme === "light"
                    ? "bg-blue-50/60 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                    : "border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                <Sun size={20} />
                <span>Light</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-bold transition-all ${
                  theme === "dark"
                    ? "bg-blue-50/60 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                    : "border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                <Moon size={20} />
                <span>Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-bold transition-all ${
                  theme === "system"
                    ? "bg-blue-50/60 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                    : "border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                <Laptop size={20} />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Language Card */}
          <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Laptop size={20} className="text-blue-600" />
              Language Selection
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 mb-5">
              Select your preferred language for the interface
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setLanguage("en")}
                className={`flex-1 rounded-2xl border py-3 text-sm font-bold transition-all ${
                  language === "en"
                    ? "bg-blue-50/60 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                    : "border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                English
              </button>

              <button
                onClick={() => setLanguage("hi")}
                className={`flex-1 rounded-2xl border py-3 text-sm font-bold transition-all ${
                  language === "hi"
                    ? "bg-blue-50/60 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                    : "border-slate-100 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Notifications and Password Settings */}
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Bell size={20} className="text-blue-600" />
              Notification Preferences
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 mb-5">
              Select which channels we use to notify you of booking and ride updates
            </p>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Email Alerts</p>
                  <p className="text-[11px] font-semibold text-slate-400">Receive receipt PDFs and scheduling reminders</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.email}
                  onChange={(e) => setNotificationPreferences({ email: e.target.checked })}
                  className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group border-t border-slate-50 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">SMS Alerts</p>
                  <p className="text-[11px] font-semibold text-slate-400">Receive instant boarding alerts on your mobile</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.sms}
                  onChange={(e) => setNotificationPreferences({ sms: e.target.checked })}
                  className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group border-t border-slate-50 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Push App Alerts</p>
                  <p className="text-[11px] font-semibold text-slate-400">Receive live emergency SOS notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.push}
                  onChange={(e) => setNotificationPreferences({ push: e.target.checked })}
                  className="h-5 w-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="lg:col-span-2 rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5 mb-2">
            <Lock size={22} className="text-blue-600" />
            Security Configuration
          </h3>
          <p className="text-xs font-semibold text-slate-400 mb-6">
            Keep your credentials updated to safeguard your wallet balance and active bookings
          </p>

          {successMsg && (
            <div className="rounded-2xl bg-green-50 dark:bg-green-950/20 p-4 text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-5">
              <CheckCircle2 size={18} />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-5">
              <AlertCircle size={18} />
              {errorMsg}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3.5 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3.5 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3.5 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200/50 dark:shadow-none transition-all disabled:opacity-60"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
