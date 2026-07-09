import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import axiosInstance from "@/api/axiosInstance";
import { UserCircle, Shield, Ship, CheckCircle, Save } from "lucide-react";

export default function Settings() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [assignedBoat, setAssignedBoat] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchBoatDetails = async () => {
      if (user?.assignedBoatId) {
        try {
          const res = await axiosInstance.get(`/boats/${user.assignedBoatId}`);
          setAssignedBoat(res.data);
        } catch (err) {
          console.error("Failed to load boat details", err);
        }
      }
    };
    fetchBoatDetails();
  }, [user?.assignedBoatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await axiosInstance.put("/users/profile", {
        name,
        phone,
        address,
      });

      updateUser(res.data);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-5">
      <div>
        <h1 className="text-3xl font-black text-blue-950">Settings & Profile</h1>
        <p className="text-slate-500">Manage your profile details and view assignments</p>
      </div>

      {success && (
        <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-6 shadow border border-blue-50/50 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <UserCircle size={64} />
              </div>
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{user?.role}</p>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2.5 text-slate-600 text-sm">
              <Shield size={16} className="text-slate-400" />
              <span>Role: <span className="font-bold text-slate-800">{user?.role}</span></span>
            </div>

            {assignedBoat ? (
              <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                <Ship size={16} className="text-slate-400" />
                <span>Assigned Boat: <span className="font-bold text-blue-700">{assignedBoat.boatName} ({assignedBoat.boatNumber})</span></span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-slate-500 text-sm">
                <Ship size={16} className="text-slate-300" />
                <span>No boat assigned.</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 text-slate-600 text-sm">
              <CheckCircle size={16} className="text-green-500" />
              <span>Account Status: <span className="font-bold text-green-600">Active</span></span>
            </div>
          </div>
        </div>

        {/* Edit profile form */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow border border-blue-50/50">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Profile Settings</h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400 outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-bold text-white shadow transition-all duration-150 disabled:bg-blue-300"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
