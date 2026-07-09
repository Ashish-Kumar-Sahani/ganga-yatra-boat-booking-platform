import { Clock, MapPin, Ship } from "lucide-react";
import type { StaffSchedule } from "../types/calendar.types";

type Props = {
  schedules?: StaffSchedule[];
};

export default function TodayTrips({ schedules = [] }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-blue-950">Today&apos;s Trips</h2>
        <p className="text-sm text-slate-500">
          Active schedules available for today
        </p>
      </div>

      {schedules.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
          No trips scheduled today.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {schedules.map((schedule) => {
            const route = schedule.routeId;

            return (
              <div
                key={schedule._id}
                className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                    <Ship size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      {schedule.boatId?.boatName || "Boat"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {schedule.boatId?.boatNumber || ""}
                    </p>
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={15} />
                  {route?.sourceGhatId?.name || "Source"} →{" "}
                  {route?.destinationGhatId?.name || "Destination"}
                </p>

                <p className="mt-3 flex items-center gap-2 text-sm font-bold text-blue-700">
                  <Clock size={15} />
                  {schedule.departureTime || "N/A"} -{" "}
                  {schedule.arrivalTime || "N/A"}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ACTIVE
                  </span>

                  <span className="text-sm font-bold text-blue-950">
                    {schedule.totalSeats || 0} Seats
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}