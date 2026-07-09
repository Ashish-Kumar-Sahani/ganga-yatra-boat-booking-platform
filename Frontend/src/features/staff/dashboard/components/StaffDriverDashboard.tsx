import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Ship, Clock, CheckCircle2, UserCheck, AlertTriangle } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import type { StaffDashboardData } from "../types/staff.types";
import StaffStats from "./StaffStats";
import StaffCharts from "./StaffCharts";

interface Props {
  data: StaffDashboardData;
}

export default function StaffDriverDashboard({ data }: Props) {
  const user = useAuthStore((state) => state.user);
  const [attStatus, setAttStatus] = useState<any>(data.attendance);
  const [attLoading, setAttLoading] = useState(false);

  const fetchAttendanceStatus = async () => {
    try {
      const res = await axiosInstance.get("/attendance/today");
      setAttStatus(res.data.record);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [data]);

  const handleCheckIn = async () => {
    try {
      setAttLoading(true);
      await axiosInstance.post("/attendance/check-in");
      await fetchAttendanceStatus();
      alert("Checked in successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Check-in failed");
    } finally {
      setAttLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setAttLoading(true);
      await axiosInstance.post("/attendance/check-out");
      await fetchAttendanceStatus();
      alert("Checked out successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Check-out failed");
    } finally {
      setAttLoading(false);
    }
  };

  const boat = data.assignedBoat;
  const todaySchedules = data.todaySchedules || [];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-800 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-black">Hello, {user?.name}!</h1>
        <p className="text-blue-100 mt-2">Here is your schedule and status for today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Boat Assignment */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Assigned Vessel</h3>
            {boat ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                    <Ship size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">{boat.boatName}</h4>
                    <p className="text-sm font-semibold text-slate-500">{boat.boatNumber}</p>
                  </div>
                </div>
                <div className="pt-4 border-t text-sm text-slate-600">
                  <p>Capacity: <span className="font-bold text-slate-800">{boat.capacity} seats</span></p>
                  <p className="mt-1">City: <span className="font-bold text-slate-800">{boat.cityId?.name || "Ganga"}</span></p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <AlertTriangle size={36} className="text-amber-500 mb-2" />
                <p className="text-sm font-bold text-slate-700">No Vessel Assigned</p>
                <p className="text-xs text-slate-500 mt-1">Please contact your administrator to assign a boat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Action Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Attendance Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Today Check-In</p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {attStatus?.checkIn ? new Date(attStatus.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Today Check-Out</p>
                <p className="font-bold text-slate-900 mt-0.5">
                  {attStatus?.checkOut ? new Date(attStatus.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </p>
              </div>
            </div>

            {attLoading ? (
              <button disabled className="w-full rounded-2xl bg-blue-100 py-4 font-bold text-blue-500">
                Updating...
              </button>
            ) : !attStatus ? (
              <button
                onClick={handleCheckIn}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={18} />
                Check In Today
              </button>
            ) : !attStatus.checkOut ? (
              <button
                onClick={handleCheckOut}
                className="w-full rounded-2xl bg-orange-600 hover:bg-orange-700 py-4 font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Check Out Today
              </button>
            ) : (
              <div className="rounded-2xl bg-green-50 p-4 text-green-700 text-center font-bold text-sm">
                Attendance complete for today!
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Today Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-semibold">Today's Passengers</span>
                <span className="text-2xl font-black text-blue-900">{data.todayBookingsCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-semibold">Scheduled Trips</span>
                <span className="text-2xl font-black text-blue-900">{todaySchedules.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips list */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Today's Trip Schedule</h3>
        {todaySchedules.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {todaySchedules.map((slot: any) => {
              const schedule = slot.scheduleId;
              const route = schedule?.routeId;
              return (
                <div key={slot._id} className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-400">
                        {schedule?.scheduleType || "DAILY"}
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                        {slot.status}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {route?.sourceGhatId?.name} → {route?.destinationGhatId?.name}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm text-blue-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {schedule?.departureTime}
                    </span>
                    <span>
                      {slot.bookedOnlineSeats || 0} / {slot.onlineSeats || 0} booked
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 font-medium bg-slate-50 rounded-2xl">
            No trips scheduled for today.
          </div>
        )}
      </div>

      {/* Real Stats cards */}
      <StaffStats data={data} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StaffCharts analytics={data.weeklyBookingAnalytics || []} />
        </div>
        
        {/* Earnings Split */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-5">Earnings Split</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center rounded-2xl bg-green-50/30 border border-green-50 p-4">
                <span className="text-sm font-semibold text-slate-500">Online Bookings</span>
                <span className="font-black text-green-700 text-lg">₹{Number(data.earningsSplit?.online || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center rounded-2xl bg-blue-50/30 border border-blue-50 p-4">
                <span className="text-sm font-semibold text-slate-500">Offline Cash</span>
                <span className="font-black text-blue-700 text-lg">₹{Number(data.earningsSplit?.offline || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center rounded-2xl bg-orange-50/30 border border-orange-50/50 p-4">
                <span className="text-sm font-semibold text-slate-500">Emergency Bookings</span>
                <span className="font-black text-orange-700 text-lg">₹{Number(data.earningsSplit?.emergency || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
