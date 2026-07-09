import {
  LayoutDashboard,
  Ship,
  CalendarCheck,
  CalendarDays,
  Users,
  Map,
  Bell,
  CreditCard,
  BarChart3,
  Settings,
  UserCheck,
} from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: any;
  roles: string[];
  permission?: string;
}

export const getStaffMenu = (role: string, permissions: string[] = []): MenuItem[] => {
  const attendanceItem = {
    label: "Attendance",
    path: "/staff/attendance",
    icon: UserCheck,
    roles: ["MANAGER", "DRIVER", "CAPTAIN", "HELPER"],
  };

  let items: MenuItem[] = [];

  switch (role) {
    case "MANAGER":
      items = [
        { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["MANAGER"], permission: "dashboard.view" },
        { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, roles: ["MANAGER"], permission: "booking.view" },
        { label: "Boats", path: "/staff/boats", icon: Ship, roles: ["MANAGER"], permission: "boat.view" },
        { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, roles: ["MANAGER"], permission: "booking.view" },
        { label: "Team", path: "/staff/team", icon: Users, roles: ["MANAGER"], permission: "staff.view" },
        { label: "Live Tracking", path: "/staff/live-tracking", icon: Map, roles: ["MANAGER"], permission: "boat.view" },
        { label: "Payments", path: "/staff/payments", icon: CreditCard, roles: ["MANAGER"], permission: "payment.view" },
        { label: "Reports", path: "/staff/reports", icon: BarChart3, roles: ["MANAGER"], permission: "report.view" },
        { label: "Notifications", path: "/staff/notifications", icon: Bell, roles: ["MANAGER"], permission: "notification.view" },
        attendanceItem,
        { label: "Settings", path: "/staff/settings", icon: Settings, roles: ["MANAGER"] },
      ];
      break;
    case "DRIVER":
      items = [
        { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["DRIVER"], permission: "dashboard.view" },
        { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, roles: ["DRIVER"], permission: "booking.view" },
        { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, roles: ["DRIVER"], permission: "booking.view" },
        { label: "Live Tracking", path: "/staff/live-tracking", icon: Map, roles: ["DRIVER"], permission: "boat.view" },
        attendanceItem,
        { label: "Notifications", path: "/staff/notifications", icon: Bell, roles: ["DRIVER"], permission: "notification.view" },
        { label: "Profile", path: "/staff/settings", icon: Settings, roles: ["DRIVER"] },
      ];
      break;
    case "CAPTAIN":
      items = [
        { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["CAPTAIN"], permission: "dashboard.view" },
        { label: "Trips", path: "/staff/live-tracking", icon: Map, roles: ["CAPTAIN"], permission: "boat.view" },
        { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, roles: ["CAPTAIN"], permission: "booking.view" },
        { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, roles: ["CAPTAIN"], permission: "booking.view" },
        attendanceItem,
        { label: "Notifications", path: "/staff/notifications", icon: Bell, roles: ["CAPTAIN"], permission: "notification.view" },
        { label: "Profile", path: "/staff/settings", icon: Settings, roles: ["CAPTAIN"] },
      ];
      break;
    case "HELPER":
      items = [
        { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["HELPER"], permission: "dashboard.view" },
        { label: "Passengers", path: "/staff/bookings", icon: CalendarCheck, roles: ["HELPER"], permission: "booking.view" },
        { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, roles: ["HELPER"], permission: "booking.view" },
        attendanceItem,
        { label: "Notifications", path: "/staff/notifications", icon: Bell, roles: ["HELPER"], permission: "notification.view" },
        { label: "Profile", path: "/staff/settings", icon: Settings, roles: ["HELPER"] },
      ];
      break;
    default:
      if (role === "SUPER_ADMIN") {
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, roles: ["MANAGER"], permission: "dashboard.view" },
          { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, roles: ["MANAGER"], permission: "booking.view" },
          { label: "Boats", path: "/staff/boats", icon: Ship, roles: ["MANAGER"], permission: "boat.view" },
          attendanceItem,
        ];
        break;
      }
      return [];
  }

  return items.filter(item => {
    if (role === "SUPER_ADMIN") return true;
    if (!item.permission) return true;
    return permissions.includes(item.permission);
  });
};