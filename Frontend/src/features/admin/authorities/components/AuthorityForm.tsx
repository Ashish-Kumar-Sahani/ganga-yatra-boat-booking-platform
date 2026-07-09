import { useState, useEffect, useRef } from "react";
import { X, Save, ShieldAlert, Key, Sparkles, Image, CheckSquare, Square } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import type { AuthorityUser } from "../types/authority.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<boolean>;
  authority: AuthorityUser | null;
  mode: "create" | "edit";
}

const ALL_PERMISSIONS = [
  "Boat Verification",
  "Permit Approval",
  "Route Approval",
  "Safety Inspection",
  "Violation Management",
  "Complaint Resolution",
  "Reports",
  "Notifications",
  "Profile Update",
  "Dashboard Access",
];

export default function AuthorityForm({ open, onClose, onSave, authority, mode }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cities, setCities] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cityId, setCityId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  // Image Upload State
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // Load Cities
  useEffect(() => {
    if (open) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const res = await axiosInstance.get("/cities");
          if (res.data && Array.isArray(res.data.cities)) {
            setCities(res.data.cities);
          } else if (Array.isArray(res.data)) {
            setCities(res.data);
          }
        } catch (err) {
          console.error("Failed to load cities in form:", err);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    }
  }, [open]);

  // Populate fields if in Edit mode
  useEffect(() => {
    if (open) {
      if (mode === "edit" && authority) {
        setName(authority.name || "");
        setEmail(authority.email || "");
        setPhone(authority.phone || "");
        setPassword("");
        setConfirmPassword("");
        setCityId(authority.cityId?._id || authority.cityId || "");
        setDepartment(authority.department || "");
        setDesignation(authority.designation || "");
        setEmployeeCode(authority.employeeCode || "");
        setStatus(authority.isActive ? "ACTIVE" : "INACTIVE");
        setSelectedPermissions(authority.permissions || []);
        setProfileImagePreview(authority.profileImage || "");
        setProfileImageFile(null);
      } else {
        // Reset fields for Create mode
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setCityId("");
        setDepartment("");
        setDesignation("");
        setEmployeeCode("");
        setStatus("ACTIVE");
        setSelectedPermissions([]);
        setProfileImagePreview("");
        setProfileImageFile(null);
      }
    }
  }, [open, mode, authority]);

  if (!open) return null;

  const handlePermissionToggle = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const generateEmployeeCode = () => {
    const code = "EMP-" + Math.floor(100000 + Math.random() * 900000);
    setEmployeeCode(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) return alert("Full Name is required");
    if (!email.trim()) return alert("Email is required");
    if (!cityId) return alert("Please select an Assigned City");
    if (!employeeCode.trim()) return alert("Employee Code is required");

    if (mode === "create") {
      if (!password) return alert("Password is required for creation");
      if (password.length < 6) return alert("Password must be at least 6 characters");
      if (password !== confirmPassword) return alert("Passwords do not match");
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phone", phone.trim());
      formData.append("cityId", cityId);
      formData.append("department", department.trim());
      formData.append("designation", designation.trim());
      formData.append("employeeCode", employeeCode.trim());
      formData.append("status", status);
      formData.append("permissions", JSON.stringify(selectedPermissions));

      if (mode === "create") {
        formData.append("password", password);
      }

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } catch (err: any) {
      alert(err.message || "Failed to save authority");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl z-10 border border-slate-100 max-h-[90vh] overflow-y-auto animate-in scale-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 hover:bg-slate-100 text-slate-400"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-black text-blue-950 border-b pb-4 mb-5">
          {mode === "create" ? "Add New City Authority" : "Edit City Authority"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold text-slate-600">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider">Account Credentials</h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@govt.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contact Phone</label>
                <input
                  type="text"
                  placeholder="Official mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            {/* Passwords (Create Only) */}
            {mode === "create" && (
              <div className="grid gap-4 sm:grid-cols-2 bg-blue-50/40 p-4 rounded-2xl border border-blue-100/50">
                <div>
                  <label className="text-[10px] font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                    <Key size={12} /> Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                    <Key size={12} /> Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Verify password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Authority Profile Info */}
          <div className="space-y-4 border-t pt-5">
            <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider">Jurisdiction & Official ID</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Assigned City *</label>
                <select
                  value={cityId}
                  required
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none cursor-pointer"
                  disabled={loadingCities}
                >
                  <option value="">Choose Assigned City...</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name} ({city.state})
                    </option>
                  ))}
                </select>
                {loadingCities && <span className="text-[10px] text-slate-400 mt-1 block">Loading cities...</span>}
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Employee Code *</label>
                <div className="flex gap-2 mt-1.5">
                  <input
                    type="text"
                    required
                    placeholder="EMP-XXXXXX"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={generateEmployeeCode}
                    className="rounded-xl border border-blue-200 bg-blue-50 text-blue-700 px-3 hover:bg-blue-100 hover:text-blue-800 transition flex items-center justify-center cursor-pointer shrink-0"
                    title="Generate Code"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Department</label>
                <input
                  type="text"
                  placeholder="e.g. River Port Trust"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Official Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Inspector"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border px-4 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Profile Image File Upload */}
          <div className="space-y-4 border-t pt-5">
            <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider">Profile Image</h3>
            
            <div className="flex items-center gap-4 p-4 border border-dashed rounded-2xl bg-slate-50/50">
              <div className="shrink-0 h-16 w-16 rounded-full bg-slate-200 overflow-hidden relative flex items-center justify-center border">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Image size={24} className="text-slate-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Choose Image File
                </button>
                <p className="text-[10px] text-slate-400 mt-1.5">JPG, PNG, or WEBP. Max size 5MB.</p>
              </div>
            </div>
          </div>

          {/* Section 4: System Permissions */}
          <div className="space-y-4 border-t pt-5">
            <h3 className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-2">
              <ShieldAlert size={14} className="text-blue-600" /> Assigned Permissions
            </h3>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {ALL_PERMISSIONS.map((perm) => {
                const isChecked = selectedPermissions.includes(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    onClick={() => handlePermissionToggle(perm)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition ${
                      isChecked
                        ? "bg-blue-50 border-blue-300 text-blue-700 font-bold shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} className="text-blue-600 shrink-0" />
                    ) : (
                      <Square size={16} className="text-slate-300 shrink-0" />
                    )}
                    <span className="truncate">{perm}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-bold shadow transition disabled:opacity-50 cursor-pointer"
            >
              <Save size={16} /> {submitting ? "Saving Official..." : "Save Official Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
