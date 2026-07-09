import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import VerifyOtp from "@/features/auth/pages/VerifyOtp";
import ResetPassword from "@/features/auth/pages/ResetPassword";

import Home from "@/features/public/home/pages/Home";
import SearchResults from "@/features/customer/search/pages/SearchResults";
import PublicSearchResults from "@/features/public/searchRoute/pages/SearchResults";
import PublicSearchRoute from "@/features/public/searchRoute/pages/SearchRoute";
import Ticket from "@/features/customer/ticket/pages/Ticket";
import PublicCities from "@/features/public/cities/pages/Cities";
import PublicGhats from "@/features/public/ghats/pages/Ghats";

import ProtectedRoute from "../routes/ProtectedRoute";
import RoleRoute from "../routes/RoleRoute";
import PermissionGuard from "../routes/PermissionGuard";

import CustomerLayout from "../layouts/CustomerLayout";
import CustomerDashboard from "@/features/customer/dashboard/pages/Dashboard";
import MyBookings from "@/features/customer/bookings/pages/MyBookings";
import Tickets from "@/features/customer/tickets/pages/Tickets";
import Support from "@/features/customer/support/pages/Support";
import BookingHistory from "@/features/customer/bookings/pages/BookingHistory";
import CustomerLiveTracking from "@/features/customer/tracking/pages/LiveTracking";
import Reviews from "@/features/customer/reviews/pages/Reviews";
import Wallet from "@/features/customer/wallet/pages/Wallet";
import Profile from "@/features/customer/profile/pages/Profile";
import BoatDetails from "@/features/customer/bookings/pages/BoatDetails";
import Booking from "@/features/customer/bookings/pages/Booking";
import Payment from "@/features/customer/payment/pages/Payment";
import Wishlist from "@/features/customer/wishlist/pages/Wishlist";
import Notifications from "@/features/customer/notifications/pages/Notifications";
import CustomerSettings from "@/features/customer/settings/pages/Settings";
import SearchTrips from "@/features/customer/searchTrips/pages/SearchTrips";

import OwnerLayout from "../layouts/OwnerLayout";
import OwnerDashboard from "@/features/owner/dashboard/pages/Dashboard";
import AddBoat from "@/features/owner/boats/pages/AddBoat";
import MyBoats from "@/features/owner/boats/pages/MyBoats";
import MySchedules from "@/features/owner/schedules/pages/MySchedules";
import AddSchedule from "@/features/owner/schedules/pages/AddSchedule";
import { MySlots } from "@/features/owner/slots";
import OwnerBookings from "@/features/owner/bookings/pages/Bookings";
import OfflineBooking from "@/features/owner/bookings/pages/offlineBooking";
import Trips from "@/features/owner/trips/pages/Trips";
import Earnings from "@/features/owner/earnings/pages/Earnings";
import Staff from "@/features/owner/staff/pages/Staff";
import Permits from "@/features/owner/permits/pages/Permits";
import OwnerProfile from "@/features/owner/profile/pages/Profile";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "@/features/admin/dashboard/pages/Dashboard";
import Users from "@/features/admin/users/pages/Users";
import BoatOwners from "@/features/admin/boatOwners/pages/BoatOwners";
import AdminCities from "@/features/admin/cities/pages/Cities";
import AdminGhats from "@/features/admin/ghats/pages/Ghats";
import AdminRoutes from "@/features/admin/routes/pages/Routes";
import Offers from "@/features/admin/offers/pages/Offers";
import Analytics from "@/features/admin/analytics/pages/Analytics";
import Settings from "@/features/admin/settings/pages/Settings";
import AdminBoats from "@/features/admin/boats/pages/AdminBoats";
import AdminBookings from "@/features/admin/bookings/pages/AdminBookings";
import AdminPayments from "@/features/admin/payments/pages/AdminPayments";
import AdminPermits from "@/features/admin/permits/pages/AdminPermits";
import AdminReports from "@/features/admin/reports/pages/AdminReports";
import AdminNotifications from "@/features/admin/notifications/pages/AdminNotifications";
import AdminProfile from "@/features/admin/profile/pages/AdminProfile";
import AuthorityList from "@/features/admin/authorities/pages/AuthorityList";

import StaffLayout from "@/features/staff/layout/StaffLayout";
import StaffDashboard from "@/features/staff/dashboard/pages/Dashboard";
import StaffBookings from "@/features/staff/bookings/pages/Bookings";
import StaffBoats from "@/features/staff/boats/pages/Boats";
import StaffCalendar from "@/features/staff/calendar/pages/Calendar";
import StaffPayments from "@/features/staff/payments/pages/Payments";
import StaffReports from "@/features/staff/reports/pages/Reports";
import StaffTeam from "@/features/staff/team/pages/Team";
import StaffNotifications from "@/features/staff/notifications/pages/Notifications";
import StaffLiveTracking from "@/features/staff/liveTracking/pages/LiveTracking";
import StaffAttendance from "@/features/staff/attendance/pages/Attendance";
import StaffSettings from "@/features/staff/settings/pages/Settings";
import StaffProfile from "@/features/staff/profile/pages/Profile";

import AuthorityLayout from "@/features/authority/layout/AuthorityLayout";
import AuthorityDashboard from "@/features/authority/dashboard/pages/Dashboard";
import AuthorityBoats from "@/features/authority/boats/pages/BoatVerification";
import AuthorityPermits from "@/features/authority/permits/pages/PermitApproval";
import AuthorityRoutes from "@/features/authority/routes/pages/RouteApproval";
import AuthorityInspections from "@/features/authority/inspections/pages/SafetyInspections";
import AuthorityViolations from "@/features/authority/violations/pages/Violations";
import AuthorityComplaints from "@/features/authority/complaints/pages/Complaints";
import AuthorityReports from "@/features/authority/reports/pages/Reports";
import AuthorityNotifications from "@/features/authority/notifications/pages/Notifications";
import AuthorityProfile from "@/features/authority/profile/pages/Profile";
import AuthoritySettings from "@/features/authority/settings/pages/Settings";
import AuthorityRefunds from "@/features/authority/refunds/pages/RefundDashboard";
import AuthorityRefundDetail from "@/features/authority/refunds/pages/RefundDetail";
import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";

export default function app(){
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="search" element={<PublicSearchResults />} />
        <Route path="/search-route" element={<PublicSearchRoute />} />
        <Route path="/cities" element={<PublicCities />} />
        <Route path="/ghats" element={<PublicGhats />} />

        {/* Ticket can stay public if QR/code sharing is allowed */}
        <Route path="/ticket/:bookingId" element={<Ticket />} />

        {/* CUSTOMER ROUTES */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["CUSTOMER"]}>
                <CustomerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="search-trips" element={<SearchTrips />} />

          <Route path="search" element={<SearchResults />} />
          <Route path="boat-details/:slotId" element={<BoatDetails />} />
          <Route path="booking/:slotId" element={<Booking />} />
          <Route path="payment/:bookingId" element={<Payment />} />

          <Route path="bookings" element={<PermissionGuard permission="booking.view"><MyBookings /></PermissionGuard>} />
          <Route path="tickets" element={<PermissionGuard permission="booking.view"><Tickets /></PermissionGuard>} />
          <Route path="support" element={<Support />} />
          <Route path="history" element={<PermissionGuard permission="booking.view"><BookingHistory /></PermissionGuard>} />
          <Route path="tracking" element={<PermissionGuard permission="booking.view"><CustomerLiveTracking /></PermissionGuard>} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="wallet" element={<PermissionGuard permission="wallet.view"><Wallet /></PermissionGuard>} />
          <Route path="profile" element={<PermissionGuard permission="profile.update"><Profile /></PermissionGuard>} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="notifications" element={<PermissionGuard permission="notification.view"><Notifications /></PermissionGuard>} />
          <Route path="settings" element={<CustomerSettings />} />
        </Route>

        {/* OLD CUSTOMER ROUTE SUPPORT */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["CUSTOMER"]}>
                <CustomerLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<MyBookings />} />
        </Route>

        {/* OWNER ROUTES */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute>
            <RoleRoute roles={["BOAT_OWNER", "MANAGER"]}>
            <OwnerLayout />
            </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/owner/dashboard" replace />} />
          <Route path="dashboard" element={<PermissionGuard permission="dashboard.view"><OwnerDashboard /></PermissionGuard>} />
          <Route path="boats" element={<PermissionGuard permission="boat.view"><MyBoats /></PermissionGuard>} />
          <Route path="add-boat" element={<PermissionGuard permission="boat.create"><AddBoat /></PermissionGuard>} />
          <Route path="schedules" element={<PermissionGuard permission="schedule.view"><MySchedules /></PermissionGuard>} />
          <Route path="add-schedule" element={<PermissionGuard permission="schedule.create"><AddSchedule /></PermissionGuard>} />
          <Route path="slots" element={<PermissionGuard permission="schedule.view"><MySlots /></PermissionGuard>} />
          <Route path="bookings" element={<PermissionGuard permission="booking.view"><OwnerBookings /></PermissionGuard>} />
          <Route path="offline-booking" element={<PermissionGuard permission="booking.update"><OfflineBooking /></PermissionGuard>} />
          <Route path="trips" element={<PermissionGuard permission="boat.view"><Trips /></PermissionGuard>} />
          <Route path="earnings" element={<PermissionGuard permission="payment.view"><Earnings /></PermissionGuard>} />
          <Route path="staff" element={<PermissionGuard permission="staff.view"><Staff /></PermissionGuard>} />
          <Route path="permits" element={<PermissionGuard permission="boat.view"><Permits /></PermissionGuard>} />
          <Route path="profile" element={<PermissionGuard permission="profile.update"><OwnerProfile /></PermissionGuard>} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["SUPER_ADMIN"]}>
                <AdminLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<PermissionGuard permission="dashboard.view"><AdminDashboard /></PermissionGuard>} />
          <Route path="users" element={<PermissionGuard permission="staff.view"><Users /></PermissionGuard>} />
          <Route path="authorities" element={<PermissionGuard permission="staff.view"><AuthorityList /></PermissionGuard>} />
          <Route path="boat-owners" element={<PermissionGuard permission="staff.view"><BoatOwners /></PermissionGuard>} />
          <Route path="boats" element={<PermissionGuard permission="boat.view"><AdminBoats /></PermissionGuard>} />
          <Route path="bookings" element={<PermissionGuard permission="booking.view"><AdminBookings /></PermissionGuard>} />
          <Route path="payments" element={<PermissionGuard permission="payment.view"><AdminPayments /></PermissionGuard>} />
          <Route path="permits" element={<PermissionGuard permission="boat.view"><AdminPermits /></PermissionGuard>} />
          <Route path="reports" element={<PermissionGuard permission="report.view"><AdminReports /></PermissionGuard>} />
          <Route path="notifications" element={<PermissionGuard permission="notification.view"><AdminNotifications /></PermissionGuard>} />
          <Route path="cities" element={<PermissionGuard permission="boat.view"><AdminCities /></PermissionGuard>} />
          <Route path="ghats" element={<PermissionGuard permission="boat.view"><AdminGhats /></PermissionGuard>} />
          <Route path="routes" element={<PermissionGuard permission="boat.view"><AdminRoutes /></PermissionGuard>} />
          <Route path="offers" element={<PermissionGuard permission="boat.view"><Offers /></PermissionGuard>} />
          <Route path="analytics" element={<PermissionGuard permission="report.view"><Analytics /></PermissionGuard>} />
          <Route path="settings" element={<PermissionGuard permission="boat.view"><Settings /></PermissionGuard>} />
          <Route path="profile" element={<PermissionGuard permission="profile.update"><AdminProfile /></PermissionGuard>} />
        </Route>

        {/* Staff ROUTES */}
<Route
  path="/staff"
  element={
    <ProtectedRoute>
      <RoleRoute roles={["MANAGER", "DRIVER", "CAPTAIN", "HELPER"]}>
        <StaffLayout />
      </RoleRoute>
    </ProtectedRoute>
  }
>
  <Route index element={<Navigate to="/staff/dashboard" replace />} />
  <Route path="dashboard" element={<PermissionGuard permission="dashboard.view"><StaffDashboard /></PermissionGuard>} />
  <Route path="boats" element={<PermissionGuard permission="boat.view"><StaffBoats /></PermissionGuard>} />
  <Route path="bookings" element={<PermissionGuard permission="booking.view"><StaffBookings /></PermissionGuard>} />
  <Route path="calendar" element={<PermissionGuard permission="booking.view"><StaffCalendar /></PermissionGuard>} />
  <Route path="team" element={<PermissionGuard permission="staff.view"><StaffTeam /></PermissionGuard>} />
  <Route path="live-tracking" element={<PermissionGuard permission="boat.view"><StaffLiveTracking /></PermissionGuard>} />
  <Route path="payments" element={<PermissionGuard permission="payment.view"><StaffPayments /></PermissionGuard>} />
  <Route path="reports" element={<PermissionGuard permission="report.view"><StaffReports /></PermissionGuard>} />
  <Route path="notifications" element={<PermissionGuard permission="notification.view"><StaffNotifications /></PermissionGuard>} />
  <Route path="attendance" element={<StaffAttendance />} />
  <Route path="settings" element={<StaffSettings />} />
  <Route path="profile" element={<StaffProfile />} />
</Route>

        {/* AUTHORITY ROUTES */}
        <Route
          path="/authority"
          element={
            <ProtectedRoute>
              <RoleRoute roles={["CITY_AUTHORITY", "SUPER_ADMIN"]}>
                <AuthorityLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/authority/dashboard" replace />} />
          <Route path="dashboard" element={<PermissionGuard permission="dashboard.view"><AuthorityDashboard /></PermissionGuard>} />
          <Route path="boats" element={<PermissionGuard permission="authority.boat.verify"><AuthorityBoats /></PermissionGuard>} />
          <Route path="permits" element={<PermissionGuard permission="authority.permit.approve"><AuthorityPermits /></PermissionGuard>} />
          <Route path="routes" element={<PermissionGuard permission="authority.route.approve"><AuthorityRoutes /></PermissionGuard>} />
          <Route path="inspections" element={<PermissionGuard permission="authority.boat.verify"><AuthorityInspections /></PermissionGuard>} />
          <Route path="violations" element={<PermissionGuard permission="authority.boat.verify"><AuthorityViolations /></PermissionGuard>} />
          <Route path="complaints" element={<PermissionGuard permission="authority.boat.verify"><AuthorityComplaints /></PermissionGuard>} />
          <Route path="reports" element={<PermissionGuard permission="report.view"><AuthorityReports /></PermissionGuard>} />
          <Route path="notifications" element={<PermissionGuard permission="notification.view"><AuthorityNotifications /></PermissionGuard>} />
          <Route path="profile" element={<PermissionGuard permission="profile.update"><AuthorityProfile /></PermissionGuard>} />
          <Route path="settings" element={<PermissionGuard permission="profile.update"><AuthoritySettings /></PermissionGuard>} />
          <Route path="refunds" element={<PermissionGuard permission="authority.permit.approve"><AuthorityRefunds /></PermissionGuard>} />
          <Route path="refunds/:bookingId" element={<PermissionGuard permission="authority.permit.approve"><AuthorityRefundDetail /></PermissionGuard>} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}