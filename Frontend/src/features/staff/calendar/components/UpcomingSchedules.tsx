import type { StaffSchedule } from "../types/calendar.types";
import { formatScheduleDate } from "@/utils/scheduleDate";

type Props = {
  schedules?: StaffSchedule[];
};

export default function UpcomingSchedules({ schedules = [] }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-blue-950">Upcoming Schedules</h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Start Date</th>
              <th>Boat</th>
              <th>Route</th>
              <th>Time</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-500">
                  No upcoming schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => {
                const route = schedule.routeId;

                return (
                  <tr key={schedule._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-semibold text-blue-950">
                      {formatScheduleDate(schedule)}
                    </td>

                    <td>{schedule.boatId?.boatName || "N/A"}</td>

                    <td>
                      {route?.sourceGhatId?.name || "Source"} →{" "}
                      {route?.destinationGhatId?.name || "Destination"}
                    </td>

                    <td>
                      {schedule.departureTime || schedule.startTime || "N/A"} -{" "}
                      {schedule.arrivalTime || schedule.endTime || "N/A"}
                    </td>

                    <td>{schedule.scheduleType || "DAILY"}</td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          schedule.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {schedule.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}