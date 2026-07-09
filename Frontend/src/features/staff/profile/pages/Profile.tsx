import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { updateProfile, updateProfileImage } from "../api/profileApi";
import { changePassword } from "@/features/auth/api/authApi";
import { UserCircle, Upload, Save, CheckCircle, ShieldAlert, Shield, Ship, Lock } from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState<"DETAILS" | "SECURITY">("DETAILS");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
      setAddress(user.address || "");
      setImagePreview(user.profileImage || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSuccessMsg("");
      setErrorMsg("");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      setImageUploading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await updateProfileImage(formData);
      updateUser(res.user);
      setImageFile(null);
      setSuccessMsg("Profile image uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await updateProfile({
        name,
        phone,
        city,
        address,
      });

      updateUser(res.user);
      setSuccessMsg("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setErrorMsg("Please fill in all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccessMsg("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-5">
      <div>
        <h1 className="text-3xl font-black text-blue-950">My Profile</h1>
        <p className="text-slate-500">Manage your account details and profile photo</p>
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700 flex items-center gap-2 border border-green-100">
          <CheckCircle size={18} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 flex items-center gap-2 border border-red-100">
          <ShieldAlert size={18} />
          {errorMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Card: Image Upload */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col items-center justify-between space-y-6">
          <div className="flex flex-col items-center w-full">
            <h3 className="text-lg font-bold text-slate-800 self-start mb-4">Profile Photo</h3>

            <div className="relative group">
              <div className="h-32 w-32 rounded-full bg-slate-50 border-2 border-blue-100 flex items-center justify-center overflow-hidden shadow-inner">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle size={80} className="text-slate-300" />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2.5 text-white hover:bg-blue-700 shadow transition-transform hover:scale-110 active:scale-95"
              >
                <Upload size={16} />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            <p className="text-xs text-slate-400 font-semibold mt-3 text-center">
              Supports JPG, PNG or WEBP. Max size 5MB.
            </p>
          </div>

          {imageFile && (
            <button
              onClick={handleImageUpload}
              disabled={imageUploading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-bold text-white transition-all disabled:bg-blue-300"
            >
              {imageUploading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Selected Image
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Card: Profile Form */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-blue-50/50 space-y-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => { setActiveTab("DETAILS"); setSuccessMsg(""); setErrorMsg(""); }}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                activeTab === "DETAILS"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Account Details
            </button>
            <button
              onClick={() => { setActiveTab("SECURITY"); setSuccessMsg(""); setErrorMsg(""); }}
              className={`pb-4 px-6 text-sm font-extrabold border-b-2 transition cursor-pointer ${
                activeTab === "SECURITY"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Security Settings
            </button>
          </div>

          {activeTab === "DETAILS" ? (
            <form onSubmit={handleProfileUpdate} className="space-y-5">
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
                  value={user?.email || ""}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400 outline-none cursor-not-allowed"
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
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
                />
              </div>
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

            <div className="border-t pt-5 mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                <Shield size={16} className="text-slate-400" />
                <span>Role: <span className="font-bold text-slate-800">{user?.role}</span></span>
              </div>

              {user?.assignedBoatId && (
                <div className="flex items-center gap-2.5 text-slate-600 text-sm">
                  <Ship size={16} className="text-slate-400" />
                  <span>Vessel Assignment Enabled</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-bold text-white shadow-sm transition-all duration-150 disabled:bg-blue-300 cursor-pointer"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Current Password</label>
              <input
                type="password"
                required
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">New Password</label>
              <input
                type="password"
                required
                placeholder="Minimum 8 characters"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                placeholder="Verify new security password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 font-bold text-white shadow-sm transition-all duration-150 disabled:bg-blue-300 cursor-pointer"
              >
                <Lock size={18} />
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>

      {/* Access Control & Scope Details */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-slate-800">Access Control & Scope Details</h3>
          <p className="text-xs text-slate-500 mt-1">
            Overview of your system role, permissions, and administrative scope boundaries.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Role</span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 px-3.5 py-1.5 text-sm font-bold border border-blue-100">
              {user?.role}
            </span>
          </div>

          {user?.ownerId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Owner Scope</span>
              <span className="text-sm font-semibold text-slate-700 block truncate">
                {typeof user.ownerId === "object" ? user.ownerId.name : user.ownerId}
              </span>
            </div>
          )}

          {user?.assignedBoatId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Boat Scope</span>
              <span className="text-sm font-semibold text-slate-700 block truncate">
                {typeof user.assignedBoatId === "object" ? user.assignedBoatId.boatName || user.assignedBoatId.name : user.assignedBoatId}
              </span>
            </div>
          )}

          {user?.cityId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City Jurisdiction</span>
              <span className="text-sm font-semibold text-slate-700 block truncate">
                {typeof user.cityId === "object" ? user.cityId.name : user.cityId}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Permissions Checklist</h4>
          <div className="flex flex-wrap gap-2">
            {user?.permissions && user.permissions.length > 0 ? (
              user.permissions.map((perm: string) => (
                <span
                  key={perm}
                  className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-bold border border-emerald-100"
                >
                  ✓ {perm}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No custom permissions assigned. Baseline permissions apply.</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
