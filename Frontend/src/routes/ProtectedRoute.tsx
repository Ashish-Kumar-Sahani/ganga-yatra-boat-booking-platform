import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {
  const token = useAuthStore(
    (state: any) => state.token
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}