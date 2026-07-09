import { useEffect, useState } from "react";
import AttendanceStats from "../components/AttendanceStats";
import AttendanceTable from "../components/AttendanceTable";
import { useAttendanceStore } from "../store/attendanceStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import axiosInstance from "@/api/axiosInstance";
import { UserCheck, CheckCircle2, RefreshCcw } from "lucide-react";

export default function Attendance() {
  const { records, loading, fetchAttendance } = useAttendanceStore();
  const user = useAuthStore((state) => state.user);

  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [personalHistory, setPersonalHistory] = useState<any[]>([]);
  const [attLoading, setAttLoading] = useState(false);

  const isManager = user?.role === "MANAGER" || user?.role === "BOAT_OWNER";

  const fetchPersonalAttendance = async () => {
    try {
      setAttLoading(true);
      const todayRes = await axiosInstance.get("/attendance/today");
      setTodayRecord(todayRes.data.record);

      const historyRes = await axiosInstance.get("/attendance/owner");
      if (Array.isArray(historyRes.data)) {
        const filtered = historyRes.data.filter((r: any) => r.staffName === user?.name);
        setPersonalHistory(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAttLoading(false);
    }
  };

  useEffect(() => {
    if (isManager) {
      fetchAttendance();
    } else {
      fetchPersonalAttendance();
    }
  }, [fetchAttendance, isManager]);

  const handleCheckIn = async () => {
    try {
      setAttLoading(true);
      await axiosInstance.post("/attendance/check-in");
      await fetchPersonalAttendance();
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
      await fetchPersonalAttendance();
      alert("Checked out successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Check-out failed");
    } finally {
      setAttLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center font-semibold">Loading attendance...</div>;
  }

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black text-blue-950">Attendance</h1>
          <p className="text-slate-500">
            {isManager
              ? "Track and manage your team's check-in/out records"
              : "Mark your daily attendance and view history"}
          </p>
        </div>

        {!isManager && (
          <button
            onClick={fetchPersonalAttendance}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        )}
      </div>

      {isManager ? (
        <>
          <AttendanceStats records={records} />
          <AttendanceTable records={records} />
        </>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Today Action Card */}
          <div className="rounded-3xl bg-white p-6 shadow border border-blue-50/50 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Today's Shift</h3>
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="text-xs text-slate-400 font-bold">CHECK IN</p>
                <p className="font-bold text-slate-900 mt-1">
                  {todayRecord?.checkIn ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold">CHECK OUT</p>
                <p className="font-bold text-slate-900 mt-1">
                  {todayRecord?.checkOut ? new Date(todayRecord.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                </p>
              </div>
            </div>

            {attLoading ? (
              <button disabled className="w-full rounded-2xl bg-blue-100 py-4 font-bold text-blue-500">
                Updating...
              </button>
            ) : !todayRecord ? (
              <button
                onClick={handleCheckIn}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-4 font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck size={18} />
                Check In Now
              </button>
            ) : !todayRecord.checkOut ? (
              <button
                onClick={handleCheckOut}
                className="w-full rounded-2xl bg-orange-600 hover:bg-orange-700 py-4 font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                Check Out Now
              </button>
            ) : (
              <div className="rounded-2xl bg-green-50 p-4 text-green-700 text-center font-bold text-sm">
                Shift completed for today!
              </div>
            )}
          </div>

          {/* Personal History */}
          <div className="md:col-span-2 rounded-3xl bg-white p-6 shadow border border-blue-50/50 space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Your Attendance History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-400 font-semibold">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Check In</th>
                    <th className="pb-3">Check Out</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {personalHistory.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 font-medium">
                        No history records found.
                      </td>
                    </tr>
                  ) : (
                    personalHistory.map((rec) => (
                      <tr key={rec._id}>
                        <td className="py-3 font-semibold text-slate-900">{rec.date}</td>
                        <td className="py-3">{rec.checkInTime}</td>
                        <td className="py-3">{rec.checkOutTime}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700`}>
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}