import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Camera,
  Save,
  Award,
  CalendarCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerDashboard,
} from "@/features/customer/dashboard/api/customerApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import API from "@/api/axiosInstance";

export default function Profile() {
  const { user, updateUser } = useAuthStore();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  const [stats, setStats] = useState({
    upcomingBookings: 0,
    totalRides: 0,
    completedRides: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await getCustomerProfile();
      const dashData = await getCustomerDashboard();

      setProfile({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        city: profileData.city || "",
        address: profileData.address || "",
      });

      if (dashData?.stats) {
        setStats(dashData.stats);
      }
    } catch (error) {
      console.error("Profile/Stats fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (key: string, value: string) => {
    setProfile({ ...profile, [key]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await updateCustomerProfile(profile);
      
      // Update auth store user details (new name, phone, city, address)
      if (user) {
        updateUser({
          ...user,
          ...res.user,
        });
      }
      alert("Profile updated successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size or type
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await API.patch("/auth/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.user) {
        // Update user state globally to instantly update navbar avatar
        updateUser({
          ...user,
          ...res.data.user,
        });
      }
      alert("Profile image uploaded successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (loading && !profile.email) {
    return <div className="p-6 font-bold text-blue-700 animate-pulse">Loading Profile...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white">My Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal details, profile picture, and view riding records
        </p>
      </header>

      {/* Profile Banner */}
      <section className="rounded-[2rem] bg-gradient-to-r from-blue-700 to-indigo-600 p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-white/20 bg-blue-900/40 relative">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-black text-white text-3xl">
                  {profile.name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <button
              onClick={triggerFileSelect}
              className="absolute -bottom-2 -right-2 rounded-full bg-white p-2.5 text-blue-700 shadow-md hover:scale-105 transition-transform"
              title="Upload new image"
            >
              <Camera size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="text-center md:text-left space-y-2">
            <h3 className="text-2xl font-black">{profile.name}</h3>
            <p className="text-blue-100 text-sm font-semibold">{profile.email}</p>

            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-white/25 px-4 py-1.5 text-xs font-bold">
                <ShieldCheck size={14} />
                Verified Account
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/30 text-yellow-100 px-4 py-1.5 text-xs font-bold border border-yellow-500/20">
                <Award size={14} />
                {stats.loyaltyPoints} Reward Points
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Summary Grid */}
      <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <MiniStatCard
          icon={<CalendarCheck size={18} className="text-blue-600" />}
          label="Upcoming Bookings"
          value={stats.upcomingBookings}
        />
        <MiniStatCard
          icon={<TrendingUp size={18} className="text-green-600" />}
          label="Total Spent"
          value={`₹${stats.totalSpent.toLocaleString()}`}
        />
        <MiniStatCard
          icon={<User size={18} className="text-slate-600" />}
          label="Rides Taken"
          value={stats.totalRides}
        />
        <MiniStatCard
          icon={<XCircle size={18} className="text-red-600" />}
          label="Cancelled Bookings"
          value={stats.cancelledBookings}
        />
      </section>

      {/* Form Fields */}
      <section className="rounded-3xl border border-blue-100/30 bg-white dark:bg-slate-800 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Personal Contact Details</h3>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileInput
            label="Full Name"
            icon={<User size={18} />}
            value={profile.name}
            onChange={(value) => handleChange("name", value)}
          />

          <div className="relative">
            <label className="mb-2 block text-xs font-bold text-slate-500 uppercase">
              Email Address (Read-only)
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40 px-4 py-3 text-slate-400">
              <Mail size={18} />
              <input
                disabled
                value={profile.email}
                className="w-full bg-transparent text-sm font-semibold outline-none cursor-not-allowed"
              />
            </div>
          </div>

          <ProfileInput
            label="Phone Number"
            icon={<Phone size={18} />}
            value={profile.phone}
            onChange={(value) => handleChange("phone", value)}
          />

          <ProfileInput
            label="City"
            icon={<MapPin size={18} />}
            value={profile.city}
            onChange={(value) => handleChange("city", value)}
          />

          <div className="md:col-span-2">
            <ProfileInput
              label="Street Address"
              icon={<MapPin size={18} />}
              value={profile.address}
              onChange={(value) => handleChange("address", value)}
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-50 dark:border-slate-700/50 pt-5">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200/50 dark:shadow-none transition-all disabled:opacity-60"
          >
            <Save size={18} />
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Access Control & Scope Details */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-700/50 pb-4">
          <h3 className="text-lg font-black text-slate-800 dark:text-white">Access Control & Scope Details</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Overview of your system role, permissions, and administrative scope boundaries.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">System Role</span>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3.5 py-1.5 text-sm font-bold border border-blue-100 dark:border-blue-900/20">
              {user?.role}
            </span>
          </div>

          {user?.ownerId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Owner Scope</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block truncate">
                {typeof user.ownerId === "object" ? user.ownerId.name : user.ownerId}
              </span>
            </div>
          )}

          {user?.assignedBoatId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Assigned Boat Scope</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block truncate">
                {typeof user.assignedBoatId === "object" ? user.assignedBoatId.boatName || user.assignedBoatId.name : user.assignedBoatId}
              </span>
            </div>
          )}

          {user?.cityId && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">City Jurisdiction</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block truncate">
                {typeof user.cityId === "object" ? user.cityId.name : user.cityId}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Permissions Checklist</h4>
          <div className="flex flex-wrap gap-2">
            {user?.permissions && user.permissions.length > 0 ? (
              user.permissions.map((perm: string) => (
                <span
                  key={perm}
                  className="inline-flex items-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold border border-emerald-100 dark:border-emerald-900/20"
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

function MiniStatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-blue-50/30 bg-white dark:bg-slate-800 p-5 shadow-sm flex items-center gap-4">
      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 p-2.5 shrink-0 border border-slate-100/10">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function ProfileInput({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-500 uppercase">
        {label}
      </span>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-transparent px-4 py-3 focus-within:border-blue-500 transition-all">
        <span className="text-blue-600">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
        />
      </div>
    </label>
  );
}