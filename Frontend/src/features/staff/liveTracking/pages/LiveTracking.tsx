import { useEffect, useState } from "react";
import { MapPinned, RefreshCcw } from "lucide-react";

import {
  getStaffLiveTrips,
  getStaffSchedulesForTracking,
} from "../api/liveTrackingApi";

import LiveTripStats from "../components/LiveTripStats";
import LiveTripTable from "../components/LiveTripTable";
import LiveBoatMap from "../components/LiveBoatMap";

import type { LiveTrip, Schedule } from "../types/liveTracking.types";

const getScheduleTripStatus = (schedule: Schedule): LiveTrip["tripStatus"] => {
  const now = new Date();

  const [depHour, depMin] = (schedule.departureTime || "00:00")
    .split(":")
    .map(Number);

  const [arrHour, arrMin] = (schedule.arrivalTime || "00:00")
    .split(":")
    .map(Number);

  const start = new Date();
  start.setHours(depHour || 0, depMin || 0, 0, 0);

  const end = new Date();
  end.setHours(arrHour || 0, arrMin || 0, 0, 0);

  if (!schedule.isActive) return "CANCELLED";

  if (now >= start && now <= end) {
    return "IN_PROGRESS";
  }

  if (now > end) {
    return "COMPLETED";
  }

  return "NOT_STARTED";
};

const scheduleToTrip = (schedule: Schedule): LiveTrip => ({
  _id: schedule._id,
  boatId: schedule.boatId,
  routeId: schedule.routeId,
  tripStatus: getScheduleTripStatus(schedule),
  passengers: 0,
  revenue: 0,
  createdAt: schedule.createdAt,
  slotId: {
    _id: schedule._id,
    scheduleId: schedule,
    status: schedule.isActive ? "OPEN" : "CLOSED",
  },
});
export default function LiveTracking() {
  const [trips, setTrips] = useState<LiveTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      setError("");

      const [tripData, scheduleData] = await Promise.allSettled([
        getStaffLiveTrips(),
        getStaffSchedulesForTracking(),
      ]);

      const liveTrips =
        tripData.status === "fulfilled" && Array.isArray(tripData.value)
          ? tripData.value
          : [];

      const schedules =
        scheduleData.status === "fulfilled" && Array.isArray(scheduleData.value)
          ? scheduleData.value
          : [];

      const fallbackTrips = schedules.map(scheduleToTrip);

      setTrips(liveTrips.length > 0 ? liveTrips : fallbackTrips);

      console.log("Live Trips:", liveTrips);
      console.log("Tracking Schedules:", schedules);
    } catch (error: any) {
      console.error("Live tracking fetch error:", error);
      setError(
        error?.response?.data?.message || "Live tracking data fetch failed"
      );
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-blue-950">
            <MapPinned className="text-blue-600" />
            Live Tracking
          </h1>
          <p className="text-slate-500">
            Track active trips, assigned boats and upcoming schedules
          </p>
        </div>

        <button
          onClick={fetchTrackingData}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <LiveTripStats trips={trips} />

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center font-semibold">
          Loading live tracking...
        </div>
      ) : (
        <>
          <LiveBoatMap trips={trips} />
          <LiveTripTable trips={trips} />
        </>
      )}
    </div>
  );
}