import { Mail, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/features/auth/api/authApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Basic client-side email pattern check
  const isEmailValid = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleFindAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    if (!isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);

      // Navigate to verify OTP screen and pass the verification context
      navigate("/verify-otp", {
        state: {
          email,
          otp: res.otp, // Dev mode OTP
          isRegister: false,
        },
      });
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || "Account not found. Please verify the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Find Your Account
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Enter your registered email address to receive a one-time verification code
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleFindAccount} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
              <Mail className="text-slate-400 w-5 h-5 shrink-0" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => {
                  setErrorMessage("");
                  setEmail(e.target.value);
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
                <span>Finding Account...</span>
              </>
            ) : (
              <>
                <span>Send Verification OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors duration-150"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}