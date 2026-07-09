import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import axiosInstance from "@/api/axiosInstance";
import PasswordStrengthMeter from "@/features/auth/components/PasswordStrengthMeter";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  Save,
  ShieldAlert,
  CreditCard,
  Lock,
} from "lucide-react";

export default function Profile() {
  const user = useAuthStore((state: any) => state.user);
  const updateUser = useAuthStore((state: any) => state.updateUser);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [address, setAddress] = useState(user?.address || "");
  
  const [updating, setUpdating] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passUpdating, setPassUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    try {
      setUpdating(true);
      // For City Authority, only phone is editable in official details
      const payload: any = { phone };
      if (user?.role !== "CITY_AUTHORITY") {
        payload.name = name;
        payload.city = city;
        payload.address = address;
      }
      
      const res = await axiosInstance.put("/auth/profile", payload);

      updateUser(res.data.user);
      alert("Profile details updated successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update profile details");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setPassUpdating(true);
      await axiosInstance.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPassUpdating(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setImageUploading(true);
      const res = await axiosInstance.patch("/auth/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(res.data.user);
      alert("Profile image uploaded and updated successfully!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to upload profile image");
    } finally {
      setImageUploading(false);
    }
  };

  const isAuthority = user?.role === "CITY_AUTHORITY";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-blue-950">Official Profile</h1>
        <p className="text-slate-500">Manage your official credentials, contact numbers, and profile settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Card: Avatar & Roles */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={user?.profileImage || "https://i.pravatar.cc/100?img=60"}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-blue-500 object-cover bg-slate-50"
            />
            <label className="absolute bottom-0 right-0 rounded-full bg-blue-600 hover:bg-blue-700 p-2 text-white cursor-pointer shadow-lg transition duration-200">
              <Camera size={16} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageUploading}
              />
            </label>
          </div>

          <h3 className="mt-4 text-xl font-black text-blue-950">{user?.name}</h3>
          <p className="text-xs font-bold text-slate-400 mt-1">{user?.email}</p>

          <div className="mt-6 w-full space-y-2 border-t pt-4 text-xs font-bold text-slate-600">
            <div className="flex items-center justify-between">
              <span>Jurisdiction</span>
              <span className="text-blue-700 font-extrabold">{user?.cityId?.name || user?.city || "General Jurisdiction"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Role</span>
              <span className="text-orange-700 font-extrabold flex items-center gap-1 uppercase">
                <ShieldAlert size={12} /> {user?.role?.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Settings form */}
        <div className="rounded-3xl bg-white border border-slate-100 p-6 shadow-sm md:col-span-2">
          <h3 className="text-lg font-black text-blue-950 border-b pb-3 mb-4">Official Information</h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Official Name {isAuthority ? "(Disabled)" : "*"}
                </label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm focus:outline-none ${
                      isAuthority ? "bg-slate-50 text-slate-400" : "focus:border-blue-600"
                    }`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isAuthority}
                    required={!isAuthority}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contact Phone</label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm focus:border-blue-600 focus:outline-none"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Office Email (Disabled)</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="email"
                  className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm bg-slate-50 text-slate-400 outline-none"
                  value={user?.email}
                  disabled
                />
              </div>
            </div>

            {isAuthority && (
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Employee Code (Disabled)</label>
                <div className="relative mt-1.5">
                  <CreditCard className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm bg-slate-50 text-slate-400 outline-none font-bold"
                    value={user?.employeeCode}
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  City Location {isAuthority ? "(Disabled)" : ""}
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm focus:outline-none ${
                      isAuthority ? "bg-slate-50 text-slate-400" : "focus:border-blue-600"
                    }`}
                    value={isAuthority ? (user?.cityId?.name || user?.city || "") : city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isAuthority}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Office Address {isAuthority ? "(Disabled)" : ""}
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm focus:outline-none ${
                      isAuthority ? "bg-slate-50 text-slate-400" : "focus:border-blue-600"
                    }`}
                    value={isAuthority ? (user?.address || "Government Office") : address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isAuthority}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold shadow transition disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} /> {updating ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </div>
          </form>

          {/* Password Change Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-black text-blue-950 mb-3 flex items-center gap-2">
              <Lock size={18} className="text-blue-600" /> Change Security Password
            </h3>
            <div className="space-y-4 text-xs font-semibold text-slate-600">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Verify new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <PasswordStrengthMeter password={newPassword} />
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={passUpdating}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-xs font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Access Control & Scope Details */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-blue-950">Access Control & Scope Details</h3>
          <p className="text-xs text-slate-500 mt-1">
            Overview of your system role, permissions, and administrative scope boundaries.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">System Role</span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 text-blue-700 px-3.5 py-1.5 text-xs font-bold border border-blue-100">
              {user?.role}
            </span>
          </div>

          {user?.ownerId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Owner Scope</span>
              <span className="text-xs font-semibold text-slate-700 block truncate">
                {typeof user.ownerId === "object" ? user.ownerId.name : user.ownerId}
              </span>
            </div>
          )}

          {user?.assignedBoatId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Boat Scope</span>
              <span className="text-xs font-semibold text-slate-700 block truncate">
                {typeof user.assignedBoatId === "object" ? user.assignedBoatId.boatName || user.assignedBoatId.name : user.assignedBoatId}
              </span>
            </div>
          )}

          {user?.cityId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City Jurisdiction</span>
              <span className="text-xs font-semibold text-slate-700 block truncate">
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
                  className="inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 text-[10px] font-bold border border-emerald-100"
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
