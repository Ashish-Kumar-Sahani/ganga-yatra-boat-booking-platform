import { X, ShieldAlert, Calendar, Building, CreditCard, Mail, Phone } from "lucide-react";
import type { AuthorityUser } from "../types/authority.types";

interface Props {
  open: boolean;
  onClose: () => void;
  authority: AuthorityUser | null;
}

export default function AuthorityDetails({ open, onClose, authority }: Props) {
  if (!open || !authority) return null;

  const permissionsList = authority.permissions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl z-10 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in scale-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 hover:bg-slate-100 text-slate-400"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-black text-blue-950 border-b pb-4 mb-5">Official Details</h2>

        <div className="space-y-6">
          {/* Header Section: Avatar, Name & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-2xl">
            <img
              src={authority.profileImage || "https://i.pravatar.cc/100?img=60"}
              alt="Official"
              className="h-24 w-24 rounded-full border-4 border-white shadow bg-white object-cover"
            />
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-2xl font-black text-blue-950">{authority.name}</h3>
              <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-wide">
                {authority.designation || "Government Official"} • {authority.department || "N/A"}
              </p>
              
              <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  authority.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {authority.isActive ? "Active Account" : "Inactive Account"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-bold">
                  <ShieldAlert size={12} />
                  CITY AUTHORITY
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs font-semibold text-slate-600">
            {/* Contact Details */}
            <div className="space-y-3 p-4 border border-slate-100 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Contact Info</h4>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800 break-all">{authority.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800">{authority.phone || "No phone added"}</span>
              </div>
            </div>

            {/* Jurisdiction & Employment */}
            <div className="space-y-3 p-4 border border-slate-100 rounded-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Employment & Jurisdiction</h4>
              <div className="flex items-center gap-3">
                <Building size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800">
                  {authority.cityId?.name ? `${authority.cityId.name} (${authority.cityId.state})` : "General/All"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm font-bold text-slate-800">Code: <b className="text-blue-600">{authority.employeeCode || "N/A"}</b></span>
              </div>
              {authority.joiningDate && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <span className="text-sm font-bold text-slate-800">
                    Joined: {new Date(authority.joiningDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-3 border-t pt-5">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Assigned System Permissions</h4>
            
            {permissionsList.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {permissionsList.map((perm) => (
                  <span
                    key={perm}
                    className="inline-flex items-center rounded-xl bg-blue-50 border border-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    ✓ {perm}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-400 italic">No permissions assigned to this authority account.</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold shadow-md transition cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
