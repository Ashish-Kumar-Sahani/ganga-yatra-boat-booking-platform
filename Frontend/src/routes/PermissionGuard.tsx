import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getMergedPermissions } from "@/utils/permissions";

type Props = {
  children: React.ReactNode;
  permission: string;
};

export default function PermissionGuard({ children, permission }: Props) {
  const user = useAuthStore((state: any) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // SUPER_ADMIN bypasses all permission checks
  if (user.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  const userPermissions = getMergedPermissions(user.role, user.permissions);

  if (!userPermissions.includes(permission)) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-850 m-6 animate-fadeIn">
        <span className="text-5xl filter drop-shadow">🔒</span>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mt-4">Access Denied</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          You do not have the required permission (<code>{permission}</code>) to view this page. If you believe this is an error, please contact your administrator.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
