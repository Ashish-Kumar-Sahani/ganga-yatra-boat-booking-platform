import { useEffect, useMemo, useState } from "react";
import { CalendarDays, RefreshCcw, Clock, MapPin, Ship } from "lucide-react";

import { getStaffSchedules } from "../api/calendarApi";
import type { StaffSchedule } from "../types/calendar.types";
import TodayTrips from "../components/TodayTrips";
import UpcomingSchedules from "../components/UpcomingSchedules";
import { isScheduleOnDate } from "@/utils/scheduleDate";

export default function Calendar() {
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getStaffSchedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Staff calendar fetch error:", error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const today = new Date();

  const todaySchedules = useMemo(() => {
    return schedules.filter((schedule) => isScheduleOnDate(schedule, today));
  }, [schedules]);

  const next7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const daySchedules = schedules.filter((s) => isScheduleOnDate(s, date));
      return {
        date,
        schedules: daySchedules,
      };
    });
  }, [schedules]);

  const selectedDayData = next7Days[selectedDayIndex];

  return (
    <div className="space-y-6 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-blue-950">
            <CalendarDays className="text-blue-600" />
            Schedule Calendar
          </h1>
          <p className="text-slate-500">
            Today's trips and upcoming 7 days schedules
          </p>
        </div>

        <button
          onClick={fetchSchedules}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center text-slate-500 font-semibold shadow flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          Loading schedules...
        </div>
      ) : (
        <>
          {/* Today's Trips */}
          <TodayTrips schedules={todaySchedules} />

          {/* Next 7 Days Interactive Selector */}
          <section className="rounded-2xl bg-white p-6 shadow space-y-6">
            <div>
              <h2 className="text-xl font-bold text-blue-950">Next 7 Days Schedule Planner</h2>
              <p className="text-sm text-slate-500">Select a day to view its scheduled trips</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {next7Days.map((day, idx) => {
                const isSelected = idx === selectedDayIndex;
                const isToday = idx === 0;

                const dayName = day.date.toLocaleDateString("en-US", { weekday: "short" });
                const dateNum = day.date.getDate();
                const monthName = day.date.toLocaleDateString("en-US", { month: "short" });

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex flex-col items-center rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
                        : "bg-white border-slate-100 hover:border-blue-300 text-slate-700"
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase opacity-80">
                      {isToday ? "Today" : dayName}
                    </span>
                    <span className="text-2xl font-black mt-1">{dateNum}</span>
                    <span className="text-xs font-bold mt-0.5">{monthName}</span>
                    <span className={`mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-blue-50 text-blue-700"
                    }`}>
                      {day.schedules.length} Trips
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t pt-5">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Trips on {selectedDayData?.date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </h3>

              {selectedDayData?.schedules.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-400">
                  No trips scheduled for this date.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedDayData?.schedules.map((schedule) => {
                    const route = schedule.routeId;
                    return (
                      <div
                        key={schedule._id}
                        className="rounded-2xl border border-blue-50 bg-blue-50/10 p-5 space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                            <Ship size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-950">
                              {schedule.boatId?.boatName || "Boat"}
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                              {schedule.boatId?.boatNumber || ""}
                            </p>
                          </div>
                        </div>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {route?.sourceGhatId?.name} → {route?.destinationGhatId?.name}
                        </p>

                        <div className="flex items-center justify-between border-t pt-3 mt-2 text-xs">
                          <span className="flex items-center gap-1 font-bold text-blue-700">
                            <Clock size={13} />
                            {schedule.departureTime} - {schedule.arrivalTime}
                          </span>
                          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-bold text-blue-700">
                            {schedule.scheduleType || "DAILY"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Schedule Table */}
          <UpcomingSchedules schedules={schedules} />
        </>
      )}
    </div>
  );
}