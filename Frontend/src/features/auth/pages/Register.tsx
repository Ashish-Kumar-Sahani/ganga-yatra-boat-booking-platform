import { Mail, Lock, User, Phone, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/features/auth/api/authApi";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import type { RegisterPayload, UserRole } from "@/features/auth/types/auth.types";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (key: keyof RegisterPayload, value: string) => {
    setErrorMessage("");
    setForm((prev) => ({
      ...prev,
      [key]: key === "role" ? (value as UserRole) : value,
    }));
  };

  // Basic client-side email pattern check
  const isEmailValid = (emailStr: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailStr);
  };

  const isPhoneValid = (phoneStr: string) => {
    const cleaned = phoneStr.replace(/[\s\-\(\)]/g, "");
    return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleaned);
  };

  // Determine password strength score for form submission lockout
  const getPasswordScore = (pass: string) => {
    if (!pass) return 0;
    const commonWeak = ["12345678", "password", "admin123", "qwerty", "123456789", "password123"];
    if (commonWeak.includes(pass.toLowerCase())) return 1;

    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const { name, email, phone, password } = form;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!isEmailValid(email)) {
      if (!email.includes("@") || email.endsWith("@") || !email.split("@")[1]) {
        setErrorMessage("Enter full email address like example@gmail.com");
      } else {
        setErrorMessage("Please enter a valid email address.");
      }
      return;
    }

    if (!isPhoneValid(phone)) {
      setErrorMessage("Please enter a valid Indian mobile number");
      return;
    }

    const passwordScore = getPasswordScore(password);
    if (passwordScore < 4) {
      setErrorMessage("Please choose a stronger password matching the complexity requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser(form);

      // Navigate to OTP verification page and pass email/testing OTP
      navigate("/verify-otp", {
        state: {
          email: form.email,
          otp: result.otp, // dev testing otp from backend
          isRegister: true,
        },
      });
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Visual side panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#05133c] to-[#0d348a] relative p-12 flex-col justify-between text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-2xl font-black tracking-tight text-orange-500">🚤 GangaYatra</span>
        </div>
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Embark on a Seamless Water Journey.
          </h2>
          <p className="text-slate-300 text-lg">
            Join the premium boat booking platform. Discover pristine rides, verify credentials, and manage bookings instantly.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} GangaYatra. All rights reserved.
        </div>
      </div>

      {/* Register form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Create Account
            </h1>
            <p className="text-sm text-slate-500">
              Start your adventure on the Ganges
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-700 animate-in fade-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
                <User className="text-slate-400 w-5 h-5 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
                  <Mail className="text-slate-400 w-5 h-5 shrink-0" />
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
                  <Phone className="text-slate-400 w-5 h-5 shrink-0" />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Role</label>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
              >
                <option value="CUSTOMER">Customer (Passenger)</option>
                <option value="BOAT_OWNER">Boat Owner / Partner</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
                <Lock className="text-slate-400 w-5 h-5 shrink-0" />
                <input
                  type="password"
                  placeholder="Create secure password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                  required
                />
              </div>
              <PasswordStrengthMeter password={form.password} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
                <Lock className="text-slate-400 w-5 h-5 shrink-0" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setErrorMessage("");
                    setConfirmPassword(e.target.value);
                  }}
                  className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex items-center justify-center gap-2 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Verification OTP...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-2">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-blue-700 hover:text-blue-800 transition-colors duration-150"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}