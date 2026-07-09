import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, ShieldAlert, Save, Lock } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useOwnerStore } from "@/features/owner/dashboard/store/ownerStore";
import { updateProfile, updateProfileImage, changePassword } from "@/features/auth/api/authApi";
import ImageUploader from "@/components/common/ImageUploader";

export default function OwnerProfile() {
  const { user, updateUser } = useAuthStore();
  const { dashboard, fetchDashboard } = useOwnerStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSection, setActiveSection] = useState<"DETAILS" | "SECURITY">("DETAILS");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateProfile(form);
      if (res.user) {
        updateUser(res.user);
        setSuccessMsg("Profile details updated successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (file: File | null) => {
    setSelectedFile(file);
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateProfileImage(file);
      if (res.user) {
        updateUser(res.user);
        setSuccessMsg("Profile avatar updated successfully!");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Avatar upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setErrorMsg("Please fill in all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccessMsg("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">Profile Settings</h2>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Manage your account credentials, contact information, and security options.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-bold text-green-700">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Avatar & Meta */}
        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-900/30">
              <img
                src={
                  user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "Owner"
                  )}&background=dbeafe&color=2563eb&size=120`
                }
                alt="Profile Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-850 dark:text-white">
              {user?.name || "Boat Owner"}
            </h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              {user?.role} Account
            </p>

            <div className="mt-6 w-full border-t border-slate-100 dark:border-slate-800/80 pt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide text-left mb-3">
                Change Profile Image
              </h4>
              <ImageUploader onFileSelect={handleImageSelect} previewUrl={user?.profileImage} />
              {uploading && <p className="text-[10px] text-blue-600 font-bold mt-2 animate-pulse">Saving image to Cloudinary...</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Editing panels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveSection("DETAILS")}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                activeSection === "DETAILS"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => setActiveSection("SECURITY")}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                activeSection === "SECURITY"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Security Settings
            </button>
          </div>

          {activeSection === "DETAILS" ? (
            <form
              onSubmit={handleUpdateDetails}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <User size={16} className="text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-transparent text-sm font-semibold outline-none text-slate-800 dark:text-slate-200"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <Phone size={16} className="text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Assigned City
                  </label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                    <MapPin size={16} className="text-slate-400" />
                    <input
                      type="text"
                      className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Street Address
                </label>
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                  <MapPin size={16} className="text-slate-400 mt-1" />
                  <textarea
                    rows={3}
                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200 resize-none"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 cursor-pointer active:scale-95 disabled:opacity-50 transition"
                >
                  <Save size={14} />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleChangePassword}
              className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 animate-fadeIn"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Current Password
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter current security password"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  New Password
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="Minimum 8 characters"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2.5 focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
                  <Lock size={16} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="Verify new security password"
                    className="w-full bg-transparent text-sm font-semibold outline-none text-slate-850 dark:text-slate-200"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 cursor-pointer active:scale-95 disabled:opacity-50 transition"
                >
                  <Lock size={14} />
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
