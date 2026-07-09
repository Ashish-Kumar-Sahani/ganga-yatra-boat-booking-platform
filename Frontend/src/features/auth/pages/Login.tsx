import { Mail, Lock, Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((state: any) => state.login);
  const returnUrl = searchParams.get("returnUrl");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const redirectByRole = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "BOAT_OWNER":
        navigate("/owner/dashboard", { replace: true });
        break;
      case "MANAGER":
      case "DRIVER":
      case "CAPTAIN":
      case "HELPER":
        navigate("/staff/dashboard", { replace: true });
        break;
      case "CUSTOMER":
        if (returnUrl) {
          navigate(returnUrl, { replace: true });
        } else {
          navigate("/customer/dashboard", { replace: true });
        }
        break;
      case "CITY_AUTHORITY":
        navigate("/authority/dashboard", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await loginUser({
        email: email.trim(),
        password,
      });

      login(result.user, result.token);

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      redirectByRole(result.user.role);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Side graphic panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#05133c] to-[#0d348a] relative p-12 flex-col justify-between text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent)] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-2xl font-black tracking-tight text-orange-500">🚤 GangaYatra</span>
        </div>
        <div className="relative z-10 max-w-lg space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Manage your rides with ease.
          </h2>
          <p className="text-slate-300 text-lg">
            Log in to access your customized booking settings, boat schedules, live tracking, and support center.
          </p>
        </div>
        <div className="relative z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} GangaYatra. All rights reserved.
        </div>
      </div>

      {/* Login form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500">
              Log in to your GangaYatra portal
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-700">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                <Lock className="text-slate-400 w-5 h-5 shrink-0" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setErrorMessage("");
                    setPassword(e.target.value);
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Log In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-2">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-bold text-blue-700 hover:text-blue-800 transition-colors duration-150"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}