import { ShieldCheck, Loader2, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, forgotPassword } from "@/features/auth/api/authApi";
import type { UserRole } from "@/features/auth/types/auth.types";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const testingOtp = location.state?.otp;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Timer states
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes OTP valid timer
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds resend cooldown
  const [resendCount, setResendCount] = useState(0);
  const maxResends = 3;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize timers
  useEffect(() => {
    if (!email) {
      alert("Session expired. Please try again.");
      navigate("/register");
      return;
    }

    // OTP Expiry Timer (5 minutes)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Resend Cooldown Timer (60 seconds)
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (timeLeft === 0) {
      setErrorMessage("OTP has expired. Please click Resend OTP to get a new code.");
      return;
    }

    if (!otp || otp.length < 6) {
      setErrorMessage("Please enter the full 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(email, otp);

      // If registration flow, the backend returns token and user info for automatic login
      if (res.token && res.user) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setSuccessMessage("Account verified successfully! Redirecting...");
        setTimeout(() => {
          redirectByRole(res.user.role);
        }, 1500);
      } else {
        // Reset Password flow
        setSuccessMessage("OTP verified successfully. Proceeding to reset password...");
        setTimeout(() => {
          navigate("/reset-password", {
            state: { email },
          });
        }, 1500);
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    if (resendCount >= maxResends) {
      setErrorMessage("You have reached the maximum resend limit. Please try again later.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Reuse forgotPassword to regenerate and email the OTP to the user
      const res = await forgotPassword(email);
      setSuccessMessage("A fresh verification code has been sent to your email.");
      setResendCount((prev) => prev + 1);

      // Reset timers
      setTimeLeft(300);
      setResendCooldown(60);

      // Re-trigger interval logs
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if (cooldownRef.current) clearInterval(cooldownRef.current);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // If development/test mode OTP returned
      if (res.otp) {
        location.state.otp = res.otp;
      }
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Verify Email
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            We sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>
          </p>
        </div>

        {testingOtp && (
          <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3.5 text-center text-xs font-bold text-orange-600 animate-pulse">
            Testing OTP (Dev Mode): {testingOtp}
          </div>
        )}

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">Verification Code</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all duration-200">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  setErrorMessage("");
                  setOtp(e.target.value.replace(/\D/g, ""));
                }}
                className="w-full text-center text-lg font-black tracking-[8px] outline-none text-slate-800 placeholder-slate-300 placeholder:tracking-normal placeholder:font-normal bg-transparent"
                required
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1">
              <span>Code expires in:</span>
              <span className={`font-semibold ${timeLeft < 60 ? "text-red-500 font-bold" : "text-slate-600"}`}>
                {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center space-y-3">
          <div className="text-xs text-slate-500">
            Didn't receive the code?
          </div>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || resendCount >= maxResends || loading}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 disabled:text-slate-400 disabled:pointer-events-none transition-colors duration-150"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {resendCooldown > 0
              ? `Resend Code in ${resendCooldown}s`
              : resendCount >= maxResends
                ? "Resend limit reached"
                : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}