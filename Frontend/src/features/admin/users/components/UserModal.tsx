import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  user: any | null;
  mode: "view" | "edit";
  onSave: (id: string, updatedData: any) => void;
};

export default function UserModal({ open, onClose, user, mode, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        isActive: user.isActive ?? true,
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user._id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-blue-950">
            {mode === "view" ? "User Profile Details" : "Edit User Profile"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-center mb-4">
            <img
              src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=dbeafe&color=2563eb&size=128`}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-blue-500 shadow-md"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              disabled={mode === "view"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              disabled={mode === "view"}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              disabled={mode === "view"}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Access Role
              </label>
              <select
                disabled={mode === "view"}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="BOAT_OWNER">BOAT_OWNER</option>
                <option value="MANAGER">MANAGER</option>
                <option value="DRIVER">DRIVER</option>
                <option value="CAPTAIN">CAPTAIN</option>
                <option value="HELPER">HELPER</option>
                <option value="CITY_AUTHORITY">CITY_AUTHORITY</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Account Status
              </label>
              <select
                disabled={mode === "view"}
                value={formData.isActive ? "true" : "false"}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-slate-50 disabled:text-slate-500"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {mode === "view" && (
            <div className="pt-2 border-t text-xs text-slate-400 space-y-1">
              <p>Registered Date: <b>{new Date(user.createdAt).toLocaleString("en-IN")}</b></p>
              <p>User Identity ID: <span className="font-mono text-[10px]">{user._id}</span></p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Close
            </button>
            {mode === "edit" && (
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700 shadow transition cursor-pointer animate-pulse-slow"
              >
                <Save size={16} /> Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
