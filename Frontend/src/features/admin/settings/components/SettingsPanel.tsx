import { useEffect, useState } from "react";
import { CreditCard, RefreshCw, KeyRound, Palette } from "lucide-react";
import { useAdminSettingsStore } from "../store/settingsStore";

export default function SettingsPanel() {
  const { settings, loading, fetchSettings, saveSettings } = useAdminSettingsStore();

  const [form, setForm] = useState({
    systemName: "",
    systemEmail: "",
    systemPhone: "",
    maintenanceMode: false,
    taxPercentage: 5,
    serviceFee: 10,
    refundPercentage: 80,
    razorpayKeyId: "",
    razorpayKeySecret: "",
    cloudinaryCloudName: "",
    primaryColor: "#2563EB",
    sidebarTheme: "light",
    freeCancellationHours: 12,
    partialRefundHours: 2,
    partialRefundPercentage: 50,
    noRefundWindow: 2,
    walletRefundEnabled: true,
    originalPaymentRefundEnabled: true,
    maxReschedules: 3,
    rescheduleFee: 50,
    weatherPolicy: "",
    ownerCancellationPolicy: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setForm({
        systemName: settings.systemName || "",
        systemEmail: settings.systemEmail || "",
        systemPhone: settings.systemPhone || "",
        maintenanceMode: settings.maintenanceMode ?? false,
        taxPercentage: settings.taxPercentage ?? 5,
        serviceFee: settings.serviceFee ?? 10,
        refundPercentage: settings.refundPercentage ?? 80,
        razorpayKeyId: settings.razorpayKeyId || "",
        razorpayKeySecret: settings.razorpayKeySecret || "",
        cloudinaryCloudName: settings.cloudinaryCloudName || "",
        primaryColor: settings.primaryColor || "#2563EB",
        sidebarTheme: settings.sidebarTheme || "light",
        freeCancellationHours: settings.freeCancellationHours ?? 12,
        partialRefundHours: settings.partialRefundHours ?? 2,
        partialRefundPercentage: settings.partialRefundPercentage ?? 50,
        noRefundWindow: settings.noRefundWindow ?? 2,
        walletRefundEnabled: settings.walletRefundEnabled ?? true,
        originalPaymentRefundEnabled: settings.originalPaymentRefundEnabled ?? true,
        maxReschedules: settings.maxReschedules ?? 3,
        rescheduleFee: settings.rescheduleFee ?? 50,
        weatherPolicy: settings.weatherPolicy || "",
        ownerCancellationPolicy: settings.ownerCancellationPolicy || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const ok = await saveSettings(form);
    if (ok) {
      setMessage("Settings updated successfully!");
    } else {
      setMessage("Failed to update system settings.");
    }
  };

  if (loading && !settings) {
    return (
      <div className="mt-6 flex justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {message && (
        <div className="bg-green-55/10 text-green-700 p-4 rounded-xl text-xs font-semibold border border-green-200 animate-fade-in max-w-lg">
          {message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Card 1: Platform & Branding */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3">
            <Palette size={18} className="text-blue-600" /> Platform & Branding
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">System Name</label>
              <input
                type="text"
                value={form.systemName}
                onChange={(e) => setForm({ ...form, systemName: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Brand Primary Color</label>
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Support Email</label>
              <input
                type="email"
                value={form.systemEmail}
                onChange={(e) => setForm({ ...form, systemEmail: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Support Phone</label>
              <input
                type="text"
                value={form.systemPhone}
                onChange={(e) => setForm({ ...form, systemPhone: e.target.value })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Maintenance Mode</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-600">Suspend public booking services</span>
            </label>
          </div>
        </div>

        {/* Card 2: Fares & Policies */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3">
            <CreditCard size={18} className="text-blue-600" /> Fares, Fees & Policies
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">CGST / SGST (%)</label>
              <input
                type="number"
                value={form.taxPercentage}
                onChange={(e) => setForm({ ...form, taxPercentage: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Service Fee (₹)</label>
              <input
                type="number"
                value={form.serviceFee}
                onChange={(e) => setForm({ ...form, serviceFee: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Refund Policy (%)</label>
              <input
                type="number"
                value={form.refundPercentage}
                onChange={(e) => setForm({ ...form, refundPercentage: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            Fares formulas: <i>Final Amount = Base Seat Fares + Taxes % + Service Fee.</i> Refunds are computed as percentage of base seat fares.
          </p>
        </div>

        {/* Card 3: Gateways & Credentials */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3">
            <KeyRound size={18} className="text-blue-600" /> Gateways & Keys
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={form.razorpayKeyId}
                onChange={(e) => setForm({ ...form, razorpayKeyId: e.target.value })}
                placeholder="rzp_live_..."
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Razorpay Secret</label>
              <input
                type="password"
                value={form.razorpayKeySecret}
                onChange={(e) => setForm({ ...form, razorpayKeySecret: e.target.value })}
                placeholder="••••••••••••"
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Cloudinary Cloud Name</label>
            <input
              type="text"
              value={form.cloudinaryCloudName}
              onChange={(e) => setForm({ ...form, cloudinaryCloudName: e.target.value })}
              placeholder="Cloud Name for photo uploads..."
              className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
            />
          </div>
        </div>

        {/* Card 4: Cancellation & Refund Policies */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3">
            <Palette size={18} className="text-blue-600" /> Cancellation & Refund Policies
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Free Cancellation Hours</label>
              <input
                type="number"
                value={form.freeCancellationHours}
                onChange={(e) => setForm({ ...form, freeCancellationHours: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Partial Refund Hours Limit</label>
              <input
                type="number"
                value={form.partialRefundHours}
                onChange={(e) => setForm({ ...form, partialRefundHours: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Partial Refund (%)</label>
              <input
                type="number"
                value={form.partialRefundPercentage}
                onChange={(e) => setForm({ ...form, partialRefundPercentage: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">No Refund Hours Limit</label>
              <input
                type="number"
                value={form.noRefundWindow}
                onChange={(e) => setForm({ ...form, noRefundWindow: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.walletRefundEnabled}
                onChange={(e) => setForm({ ...form, walletRefundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-650">Allow Wallet Refunds</span>
            </label>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.originalPaymentRefundEnabled}
                onChange={(e) => setForm({ ...form, originalPaymentRefundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-650">Allow Original Payment Refunds</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Weather Policy Statement</label>
            <textarea
              value={form.weatherPolicy}
              onChange={(e) => setForm({ ...form, weatherPolicy: e.target.value })}
              rows={2}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Owner Cancellation Policy Statement</label>
            <textarea
              value={form.ownerCancellationPolicy}
              onChange={(e) => setForm({ ...form, ownerCancellationPolicy: e.target.value })}
              rows={2}
              className="w-full rounded-xl border px-3 py-2 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
            />
          </div>
        </div>

        {/* Card 5: Rescheduling Rules */}
        <div className="rounded-2xl bg-white p-6 shadow border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-blue-950 flex items-center gap-2 border-b pb-3">
            <RefreshCw size={18} className="text-blue-650" /> Rescheduling Rules
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Max Reschedules Allowed</label>
              <input
                type="number"
                value={form.maxReschedules}
                onChange={(e) => setForm({ ...form, maxReschedules: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Reschedule Fee (₹)</label>
              <input
                type="number"
                value={form.rescheduleFee}
                onChange={(e) => setForm({ ...form, rescheduleFee: Number(e.target.value) })}
                className="w-full rounded-xl border px-3 py-2.5 text-sm focus:border-blue-500 outline-none bg-slate-50/50"
                required
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Rescheduling fees will be deducted from customer wallet balance. Max reschedules limit restricts how many times a ticket can be modified.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 max-w-4xl pt-4 border-t">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold shadow transition cursor-pointer"
        >
          {loading ? "Saving Changes..." : "Save System Configuration"}
        </button>
      </div>
    </form>
  );
}