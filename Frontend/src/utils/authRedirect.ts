import type { UserRole } from "@/features/auth/types/auth.types";

export const getDashboardRoute = (role?: UserRole | string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";

    case "OWNER":
      return "/owner/dashboard";

    case "MANAGER":
      return "/manager/dashboard";

    case "CUSTOMER":
      return "/customer/dashboard";

    default:
      return "/login";
  }
};