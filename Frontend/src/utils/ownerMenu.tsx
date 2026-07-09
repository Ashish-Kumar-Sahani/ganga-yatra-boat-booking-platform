import {
  LayoutDashboard,
  Ship,
  PlusCircle,
  CalendarDays,
  Clock,
  Ticket,
  Route,
  Users,
  Wallet,
  FileCheck,
} from "lucide-react";

export const ownerMenu = [
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
];