import { useState, useRef } from "react";
import {
  User as UserIcon,
  ShieldCheck,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
  MapPin,
  Calendar,
  AlertCircle,
  Upload,
  Activity,
  History,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import {
  updateProfile,
  updateProfileImage,
  changePassword,
} from "@/features/auth/api/authApi";
import PasswordStrengthMeter from "@/features/auth/components/PasswordStrengthMeter";

export default function AdminProfile() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile fields state
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  // Passwords state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Image upload states
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Status states
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<"DETAILS" | "SECURITY" | "ACTIVITY" | "ACCESS">("DETAILS");

  // Mock activity feed
  const [activities] = useState([
    { id: 1, action: "Admin profile details updated", time: "Just now", ip: "192.168.43.10" },
    { id: 2, action: "Dashboard records queried", time: "10 mins ago", ip: "192.168.43.10" },
    { id: 3, action: "Console session initiated via JWT", time: "1 hour ago", ip: "192.168.43.10" },
    { id: 4, action: "Permits audit checks run", time: "Yesterday", ip: "192.168.1.15" },
  ]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size must not exceed 5MB.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateProfileImage(selectedFile);
      if (res.user) {
        updateUser(res.user);
        setSuccessMsg("Profile photo uploaded and synced successfully!");
        setPreviewImage(null);
        setSelectedFile(null);
      } else {
        setErrorMsg("Failed to upload profile photo.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPhoto = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await updateProfile({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        address: form.address,
      });
      if (res.user) {
        updateUser(res.user);
        setSuccessMsg("Details saved successfully!");
      } else {
        setErrorMsg("Failed to save changes.");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      setErrorMsg("Please fill out all password fields.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    setLoadingPassword(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setSuccessMsg("Security password updated successfully.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const currentAvatar = previewImage || user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=dbeafe&color=2563eb&size=128`;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header and alerts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950">Security & Profile Details</h1>
          <p className="text-sm text-slate-500 mt-1">Manage GangaYatra credentials, upload Cloudinary avatar, and audit admin logs.</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-xs font-semibold border border-green-200 flex items-center gap-2 animate-fade-in shadow-sm">
          <ShieldCheck size={16} className="text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-semibold border border-red-200 flex items-center gap-2 animate-fade-in shadow-sm">
          <AlertCircle size={16} className="text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Column: Avatar Card & System Readonly details */}
        <div className="space-y-6">
          
          {/* Avatar card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
            
            <div className="relative group cursor-pointer mt-4" onClick={handlePhotoClick}>
              <img
                src={currentAvatar}
                alt="Avatar"
                className="h-32 w-32 rounded-full object-cover border-4 border-slate-50 shadow-lg transition duration-200 group-hover:scale-95 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200">
                <Camera size={24} />
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <h3 className="mt-4 font-black text-lg text-blue-950">{user?.name || "Super Admin"}</h3>
            <span className="mt-1.5 rounded-full bg-blue-50 text-blue-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-blue-100">
              <ShieldCheck size={12} /> {user?.role || "SUPER_ADMIN"}
            </span>

            {/* Photo saving buttons if file selected */}
            {selectedFile && (
              <div className="mt-5 w-full flex items-center gap-2 justify-center animate-fade-in bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <button
                  onClick={handleUploadPhoto}
                  disabled={uploading}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-[10px] font-bold shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <Upload size={12} /> {uploading ? "Saving..." : "Upload Photo"}
                </button>
                <button
                  onClick={handleCancelPhoto}
                  disabled={uploading}
                  className="rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 px-3 py-1.5 text-[10px] font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="mt-6 w-full space-y-3 text-xs text-slate-500 border-t border-slate-50 pt-5">
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="truncate font-semibold text-slate-700">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* System metadata (Readonly card) */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-2">
              System Info (Read-Only)
            </h4>
            
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Console User ID</span>
              <code className="text-xs font-mono bg-slate-50 text-slate-600 px-2 py-1 rounded block mt-1 overflow-x-auto select-all border border-slate-100">
                {user?.id || "507f1f77bcf86cd799439011"}
              </code>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Designation</span>
                <span className="text-xs font-bold text-slate-700 block mt-1">Super Administrator</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Created Date</span>
                <span className="text-xs font-bold text-slate-700 block mt-1 flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive details, settings, and logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            {(["DETAILS", "SECURITY", "ACTIVITY", "ACCESS"] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`py-3 px-6 text-xs font-bold uppercase tracking-wider border-b-2 transition select-none cursor-pointer ${
                  activeSection === sec
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {sec.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Section content */}
          {activeSection === "DETAILS" && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="text-base font-extrabold text-blue-950 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                <UserIcon size={18} className="text-blue-600" /> Personal & Contact Info
              </h2>

              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Full Name</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <UserIcon size={16} className="text-slate-400" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Email Address</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Mail size={16} className="text-slate-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Phone size={16} className="text-slate-400" />
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Operational City</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <MapPin size={16} className="text-slate-400" />
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Varanasi, UP..."
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Office Address</label>
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                    <MapPin size={16} className="text-slate-400 mt-1 shrink-0" />
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Enter office control desk details..."
                      className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-xs font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Save size={16} /> {loading ? "Saving Changes..." : "Save Details"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "SECURITY" && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="text-base font-extrabold text-blue-950 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-blue-600" /> Change Security Password
              </h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Current Password</label>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">New Password</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Min 6 characters..."
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                        required
                      />
                    </div>
                    <PasswordStrengthMeter password={passwords.newPassword} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 transition">
                      <Lock size={16} className="text-slate-400" />
                      <input
                        type="password"
                        placeholder="Re-enter new password..."
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="bg-transparent text-sm font-semibold outline-none w-full text-slate-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-xs font-bold shadow-md shadow-blue-500/10 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Lock size={16} /> {loadingPassword ? "Changing Password..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "ACTIVITY" && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="text-base font-extrabold text-blue-950 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                <Activity size={18} className="text-blue-600" /> Console Session Logs
              </h2>

              <div className="relative border-l border-slate-100 pl-5 ml-2.5 space-y-5 py-2">
                {activities.map((act) => (
                  <div key={act.id} className="relative group">
                    {/* Tick mark */}
                    <span className="absolute -left-[27px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-white group-hover:bg-blue-500 transition"></span>
                    
                    <div className="text-xs font-bold text-slate-800">{act.action}</div>
                    <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <History size={10} /> {act.time}
                      </span>
                      <span>•</span>
                      <span>IP Address: {act.ip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "ACCESS" && (
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 animate-fade-in space-y-6">
              <h2 className="text-base font-extrabold text-blue-950 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600" /> Access Control & Scope Details
              </h2>
              
              <div className="grid gap-6 md:grid-cols-2">
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
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Permissions Checklist</h4>
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
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
