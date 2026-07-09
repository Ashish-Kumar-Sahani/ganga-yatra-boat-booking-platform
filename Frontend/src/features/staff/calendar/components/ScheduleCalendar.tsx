import type { StaffSchedule } from "../types/calendar.types";
import { isScheduleOnDate } from "@/utils/scheduleDate";

type Props = {
  schedules?: StaffSchedule[];
};

const getNextDays = (count = 7) => {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
};

export default function ScheduleCalendar({ schedules = [] }: Props) {
  const days = getNextDays(7);

  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-blue-950">
            Next 7 Days Schedule
          </h2>
          <p className="text-sm text-slate-500">
            Upcoming active boat schedules day-wise
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        {days.map((day) => {
          const daySchedules = schedules.filter((schedule) =>
            isScheduleOnDate(schedule, day)
          );

          const isToday =
            day.toDateString() === new Date().toDateString();

          return (
            <div
              key={day.toISOString()}
              className={`rounded-2xl border p-4 ${
                isToday
                  ? "border-blue-500 bg-blue-50"
                  : "border-blue-100 bg-white"
              }`}
            >
              <p className="text-sm font-bold text-slate-500">
                {day.toLocaleDateString("en-IN", { weekday: "short" })}
              </p>

              <h3 className="mt-1 text-2xl font-black text-blue-950">
                {day.getDate()}
              </h3>

              <p className="mt-1 text-xs font-semibold text-slate-500">
                {day.toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="mt-4 space-y-2">
                {daySchedules.length === 0 ? (
                  <p className="rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-500">
                    No Schedule
                  </p>
                ) : (
                  daySchedules.map((schedule) => (
                    <div
                      key={schedule._id}
                      className="rounded-xl bg-white p-3 shadow-sm"
                    >
                      <p className="font-bold text-blue-950">
                        {schedule.boatId?.boatName || "Boat"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {schedule.departureTime} - {schedule.arrivalTime}
                      </p>

                      <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
                        {schedule.scheduleType || "DAILY"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}