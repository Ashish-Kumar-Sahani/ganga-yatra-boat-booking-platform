import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Settings,
  Lock,
  Bell,
  Sun,
  HelpCircle,
  LogOut,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileDropdown({ open, onClose }: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogout = () => {
    onClose();
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const avatarUrl = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=dbeafe&color=2563eb&size=64`;

  return (
    <div className="absolute right-0 top-16 w-72 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50 animate-fade-in text-slate-800">
      
      {/* Header Info */}
      <div className="flex items-center gap-3 border-b border-slate-100 p-3 mb-1.5">
        <img
          src={avatarUrl}
          alt="Avatar"
          className="h-11 w-11 rounded-full object-cover border border-slate-200"
        />
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold text-slate-800 truncate">{user?.name || "Super Admin"}</h4>
          <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || "admin@gangayatra.com"}</p>
          <span className="inline-flex items-center gap-1.5 mt-1 text-[9px] font-extrabold bg-blue-50 text-blue-600 rounded px-1.5 py-0.5 uppercase tracking-wide">
            <Shield size={10} /> {user?.role || "SUPER_ADMIN"}
          </span>
        </div>
      </div>

      {/* Menu links */}
      <div className="space-y-0.5">
        <button
          onClick={() => handleNavigate("/admin/profile")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <UserIcon size={14} className="text-slate-400" />
          <span>View Profile</span>
        </button>

        <button
          onClick={() => handleNavigate("/admin/profile")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <Settings size={14} className="text-slate-400" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={() => handleNavigate("/admin/profile")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <Lock size={14} className="text-slate-400" />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => handleNavigate("/admin/settings")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <Bell size={14} className="text-slate-400" />
          <span>Notification Settings</span>
        </button>

        <button
          onClick={() => handleNavigate("/admin/settings")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <Settings size={14} className="text-slate-400" />
          <span>Account Settings</span>
        </button>

        <div className="border-t border-slate-100 my-1"></div>

        <div className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50/50 transition">
          <div className="flex items-center gap-3">
            <Sun size={14} className="text-slate-400" />
            <span>Theme Settings</span>
          </div>
          <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">Light</span>
        </div>

        <button
          onClick={() => {}}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-blue-50/50 hover:text-blue-900 transition"
        >
          <HelpCircle size={14} className="text-slate-400" />
          <span>Help Center</span>
        </button>

        <div className="border-t border-slate-100 my-1"></div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={14} className="text-red-500" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}