import {
  LayoutDashboard,
  Ship,
  FileCheck,
  Route,
  ShieldAlert,
  AlertTriangle,
  MessageSquare,
  FileSpreadsheet,
  Bell,
  User,
  Settings,
} from "lucide-react";

export const authorityMenu = [
  { label: "Dashboard", path: "/authority/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
  { label: "Boat Verification", path: "/authority/boats", icon: Ship, permission: "authority.boat.verify" },
  { label: "Permit Requests", path: "/authority/permits", icon: FileCheck, permission: "authority.permit.approve" },
  { label: "Route Approvals", path: "/authority/routes", icon: Route, permission: "authority.route.approve" },
  { label: "Safety Inspections", path: "/authority/inspections", icon: ShieldAlert, permission: "authority.boat.verify" },
  { label: "Violations", path: "/authority/violations", icon: AlertTriangle, permission: "authority.boat.verify" },
  { label: "Complaints", path: "/authority/complaints", icon: MessageSquare, permission: "authority.boat.verify" },
  { label: "Reports", path: "/authority/reports", icon: FileSpreadsheet, permission: "report.view" },
  { label: "Notifications", path: "/authority/notifications", icon: Bell, permission: "notification.view" },
  { label: "Profile", path: "/authority/profile", icon: User, permission: "profile.update" },
  { label: "Settings", path: "/authority/settings", icon: Settings, permission: "profile.update" },
];
