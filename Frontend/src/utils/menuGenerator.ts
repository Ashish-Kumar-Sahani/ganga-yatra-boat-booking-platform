import {
  LayoutDashboard,
  Users,
  Ship,
  Building2,
  MapPin,
  Route,
  BookOpen,
  CreditCard,
  ShieldCheck,
  BadgePercent,
  Bell,
  FileText,
  Settings,
  UserCircle,
  Shield,
  Award,
  UserCheck,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  Map,
  PlusCircle,
  Clock,
  Ticket,
  Wallet,
  FileCheck,
  Home,
  Search,
  History,
  MapPinned,
  Heart,
  Star,
  LifeBuoy,
  ShieldAlert,
  AlertTriangle,
  MessageSquare,
  FileSpreadsheet,
  User as UserIcon,
} from "lucide-react";
import { getMergedPermissions } from "./permissions";

export interface MenuItem {
  label: string;
  path: string;
  icon: any;
  permission?: string;
  roles?: string[];
  badgeKey?: "notifications" | "bookings";
  badge?: any;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const getMenuForPanel = (
  panel: string,
  role: string,
  permissions: string[] = []
): any => {
  const isSuperAdmin = role === "SUPER_ADMIN";

  const hasPermission = (perm?: string) => {
    if (!perm) return true;
    if (isSuperAdmin) return true;
    const userPermissions = getMergedPermissions(role, permissions);
    return userPermissions.includes(perm);
  };

  switch (panel) {
    case "admin": {
      const sections: MenuSection[] = [
        {
          title: "Overview",
          items: [
            { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
            { label: "Analytics", path: "/admin/analytics", icon: BarChart3, permission: "report.view" },
          ],
        },
        {
          title: "User Management",
          items: [
            { label: "User Directory", path: "/admin/users", icon: Users, permission: "staff.view" },
            { label: "Boat Owners", path: "/admin/boat-owners", icon: Shield, permission: "staff.view" },
            { label: "Authorities", path: "/admin/authorities", icon: UserCheck, permission: "staff.view" },
            { label: "Customers", path: "/admin/users?role=CUSTOMER", icon: Users, permission: "staff.view" },
            { label: "Staff", path: "/admin/users?role=DRIVER", icon: Award, permission: "staff.view" },
          ],
        },
        {
          title: "Operational Masters",
          items: [
            { label: "Cities", path: "/admin/cities", icon: Building2, permission: "boat.view" },
            { label: "Ghats", path: "/admin/ghats", icon: MapPin, permission: "boat.view" },
            { label: "Routes", path: "/admin/routes", icon: Route, permission: "boat.view" },
            { label: "Boats", path: "/admin/boats", icon: Ship, permission: "boat.view" },
          ],
        },
        {
          title: "Operations & Audits",
          items: [
            { label: "Bookings", path: "/admin/bookings", icon: BookOpen, permission: "booking.view" },
            { label: "Payments", path: "/admin/payments", icon: CreditCard, permission: "payment.view" },
            { label: "Permits", path: "/admin/permits", icon: ShieldCheck, permission: "boat.view" },
            { label: "Offers", path: "/admin/offers", icon: BadgePercent, permission: "boat.view" },
          ],
        },
        {
          title: "System & logs",
          items: [
            { label: "Notifications", path: "/admin/notifications", icon: Bell, badgeKey: "notifications", permission: "notification.view" },
            { label: "Reports", path: "/admin/reports", icon: FileText, permission: "report.view" },
            { label: "System Settings", path: "/admin/settings", icon: Settings, permission: "boat.view" },
            { label: "Profile", path: "/admin/profile", icon: UserCircle, permission: "profile.update" },
          ],
        },
      ];

      return sections
        .map((sec) => ({
          ...sec,
          items: sec.items.filter((item) => hasPermission(item.permission)),
        }))
        .filter((sec) => sec.items.length > 0);
    }

    case "owner": {
      const menu: MenuItem[] = [
        { label: "Dashboard", path: "/owner", icon: LayoutDashboard, permission: "dashboard.view" },
        { label: "My Boats", path: "/owner/boats", icon: Ship, permission: "boat.view" },
        { label: "Add Boat", path: "/owner/add-boat", icon: PlusCircle, permission: "boat.create" },
        { label: "Schedules", path: "/owner/schedules", icon: CalendarDays, permission: "schedule.view" },
        { label: "Slots", path: "/owner/slots", icon: Clock, permission: "schedule.view" },
        { label: "Bookings", path: "/owner/bookings", icon: Ticket, permission: "booking.view" },
        { label: "Offline Booking", path: "/owner/offline-booking", icon: Ticket, permission: "booking.update" },
        { label: "Trips", path: "/owner/trips", icon: Route, permission: "boat.view" },
        { label: "Earnings", path: "/owner/earnings", icon: Wallet, permission: "payment.view" },
        { label: "Staff", path: "/owner/staff", icon: Users, permission: "staff.view" },
        { label: "Permits", path: "/owner/permits", icon: FileCheck, permission: "boat.view" },
        { label: "Profile", path: "/owner/profile", icon: UserCircle, permission: "profile.update" },
      ];

      return menu.filter((item) => hasPermission(item.permission));
    }

    case "staff": {
      const attendanceItem: MenuItem = {
        label: "Attendance",
        path: "/staff/attendance",
        icon: UserCheck,
        roles: ["MANAGER", "DRIVER", "CAPTAIN", "HELPER"],
      };

      let items: MenuItem[] = [];

      if (role === "MANAGER") {
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
          { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, permission: "booking.view" },
          { label: "Boats", path: "/staff/boats", icon: Ship, permission: "boat.view" },
          { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, permission: "booking.view" },
          { label: "Team", path: "/staff/team", icon: Users, permission: "staff.view" },
          { label: "Live Tracking", path: "/staff/live-tracking", icon: Map, permission: "boat.view" },
          { label: "Payments", path: "/staff/payments", icon: CreditCard, permission: "payment.view" },
          { label: "Reports", path: "/staff/reports", icon: BarChart3, permission: "report.view" },
          { label: "Notifications", path: "/staff/notifications", icon: Bell, permission: "notification.view" },
          attendanceItem,
          { label: "Settings", path: "/staff/settings", icon: Settings },
        ];
      } else if (role === "DRIVER") {
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
          { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, permission: "booking.view" },
          { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, permission: "booking.view" },
          { label: "Live Tracking", path: "/staff/live-tracking", icon: Map, permission: "boat.view" },
          attendanceItem,
          { label: "Notifications", path: "/staff/notifications", icon: Bell, permission: "notification.view" },
          { label: "Profile", path: "/staff/settings", icon: Settings },
        ];
      } else if (role === "CAPTAIN") {
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
          { label: "Trips", path: "/staff/live-tracking", icon: Map, permission: "boat.view" },
          { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, permission: "booking.view" },
          { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, permission: "booking.view" },
          attendanceItem,
          { label: "Notifications", path: "/staff/notifications", icon: Bell, permission: "notification.view" },
          { label: "Profile", path: "/staff/settings", icon: Settings },
        ];
      } else if (role === "HELPER") {
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
          { label: "Passengers", path: "/staff/bookings", icon: CalendarCheck, permission: "booking.view" },
          { label: "Calendar", path: "/staff/calendar", icon: CalendarDays, permission: "booking.view" },
          attendanceItem,
          { label: "Notifications", path: "/staff/notifications", icon: Bell, permission: "notification.view" },
          { label: "Profile", path: "/staff/settings", icon: Settings },
        ];
      } else {
        // Fallback for custom or superadmin checking staff menu
        items = [
          { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
          { label: "Bookings", path: "/staff/bookings", icon: CalendarCheck, permission: "booking.view" },
          { label: "Boats", path: "/staff/boats", icon: Ship, permission: "boat.view" },
          attendanceItem,
        ];
      }

      return items.filter((item) => hasPermission(item.permission));
    }

    case "authority": {
      const menu: MenuItem[] = [
        { label: "Dashboard", path: "/authority/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
        { label: "Refund Approvals", path: "/authority/refunds", icon: CreditCard, permission: "authority.permit.approve" },
        { label: "Boat Verification", path: "/authority/boats", icon: Ship, permission: "authority.boat.verify" },
        { label: "Permit Requests", path: "/authority/permits", icon: FileCheck, permission: "authority.permit.approve" },
        { label: "Route Approvals", path: "/authority/routes", icon: Route, permission: "authority.route.approve" },
        { label: "Safety Inspections", path: "/authority/inspections", icon: ShieldAlert, permission: "authority.boat.verify" },
        { label: "Violations", path: "/authority/violations", icon: AlertTriangle, permission: "authority.boat.verify" },
        { label: "Complaints", path: "/authority/complaints", icon: MessageSquare, permission: "authority.boat.verify" },
        { label: "Reports", path: "/authority/reports", icon: FileSpreadsheet, permission: "report.view" },
        { label: "Notifications", path: "/authority/notifications", icon: Bell, permission: "notification.view" },
        { label: "Profile", path: "/authority/profile", icon: UserIcon, permission: "profile.update" },
        { label: "Settings", path: "/authority/settings", icon: Settings, permission: "profile.update" },
      ];

      return menu.filter((item) => hasPermission(item.permission));
    }

    case "customer": {
      const menu: MenuItem[] = [
        { label: "Dashboard", path: "/customer/dashboard", icon: Home, permission: "dashboard.view" },
        { label: "Search Trips", path: "/customer/search-trips", icon: Search },
        { label: "My Bookings", path: "/customer/bookings", icon: CalendarCheck, permission: "booking.view" },
        { label: "Booking History", path: "/customer/history", icon: History, permission: "booking.view" },
        { label: "Tickets", path: "/customer/tickets", icon: Ticket, permission: "booking.view" },
        { label: "Live Tracking", path: "/customer/tracking", icon: MapPinned, permission: "booking.view" },
        { label: "Wishlist", path: "/customer/wishlist", icon: Heart },
        { label: "Wallet", path: "/customer/wallet", icon: Wallet, permission: "wallet.view" },
        { label: "Reviews", path: "/customer/reviews", icon: Star },
        { label: "Notifications", path: "/customer/notifications", icon: Bell, permission: "notification.view" },
        { label: "Profile", path: "/customer/profile", icon: UserIcon, permission: "profile.update" },
        { label: "Settings", path: "/customer/settings", icon: Settings },
        { label: "Support", path: "/customer/support", icon: LifeBuoy },
      ];

      return menu.filter((item) => hasPermission(item.permission));
    }

    default:
      return [];
  }
};
