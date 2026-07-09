import { Lock, Loader2, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "@/features/auth/api/authApi";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import type { UserRole } from "@/features/auth/types/auth.types";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        navigate("/admin/dashboard");
        break;
      case "BOAT_OWNER":
        navigate("/owner/dashboard");
        break;
      case "MANAGER":
        navigate("/manager/dashboard");
        break;
      case "CUSTOMER":
        navigate("/customer/dashboard");
        break;
      default:
        navigate("/login");
    }
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage("Email session missing. Please start over.");
      setTimeout(() => navigate("/forgot-password"), 2000);
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill out both password fields.");
      return;
    }

    const passwordScore = getPasswordScore(newPassword);
    if (passwordScore < 4) {
      setErrorMessage("New password is not strong enough. Please satisfy complexity criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(email, newPassword);

      setSuccessMessage("Password reset successful! Logging you in...");

      // Automatically login if token + user info returned (SaaS standard)
      if (res.token && res.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setTimeout(() => {
          redirectByRole(res.user.role);
        }, 1500);
      } else {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Reset Password
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Choose a strong, unique password to secure your account
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">New Password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Lock className="text-slate-400 w-5 h-5 shrink-0" />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setErrorMessage("");
                  setNewPassword(e.target.value);
                }}
                className="w-full outline-none text-sm text-slate-800 placeholder-slate-400 bg-transparent"
                required
              />
            </div>
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Confirm Password</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Lock className="text-slate-400 w-5 h-5 shrink-0" />
              <input
                type="password"
                placeholder="Confirm your password"
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
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password & Log In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}