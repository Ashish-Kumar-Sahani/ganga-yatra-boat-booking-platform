import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

type Props = {
  children: React.ReactNode;
  roles: string[];
};

export default function RoleRoute({
  children,
  roles,
}: Props) {
  const user = useAuthStore(
    (state: any) => state.user
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}