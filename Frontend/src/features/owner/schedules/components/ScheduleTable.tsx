import {
  createSchedule,
  deleteSchedule,
  updateScheduleStatus,
} from "@/features/owner/schedules/api/scheduleApi";
import { generateSlots } from "@/features/owner/slots/api/slotApi";

type Props = {
  schedules?: any[];
  onRefresh?: () => Promise<void>;
  onEdit?: (schedule: any) => void;
};

export default function ScheduleTable({
  schedules = [],
  onRefresh,
  onEdit,
}: Props) {
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateScheduleStatus(id, !currentStatus);
    await onRefresh?.();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this schedule?")) return;
    await deleteSchedule(id);
    await onRefresh?.();
  };

  const handleDuplicate = async (schedule: any) => {
    if (!window.confirm("Duplicate this schedule?")) return;

    await createSchedule({
      boatId: schedule.boatId?._id,
      routeId: schedule.routeId?._id,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      totalSeats: schedule.totalSeats,
      onlineSeats: schedule.onlineSeats,
      offlineSeats: schedule.offlineSeats,
      emergencySeats: schedule.emergencySeats,
      scheduleType: schedule.scheduleType,
      isActive: true,
    });

    await onRefresh?.();
  };

  const handleGenerateSlots = async (scheduleId: string) => {
    if (!window.confirm("Generate next 30 days slots for this schedule?")) return;

    await generateSlots({
      scheduleId,
      days: 30,
    });

    alert("30 days slots generated");
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">My Schedules</h3>

      {schedules.length === 0 ? (
        <p className="text-sm text-slate-500">No schedules found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-3">Boat</th>
                <th>Route</th>
                <th>Time</th>
                <th>Seats</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule._id} className="border-b last:border-0">
                  <td className="py-3 font-medium text-blue-950">
                    {schedule.boatId?.boatName || "N/A"}
                    <p className="text-xs text-slate-500">
                      {schedule.boatId?.boatNumber || ""}
                    </p>
                  </td>

                  <td>
                    {schedule.routeId?.sourceGhatId?.name || "Source"} →{" "}
                    {schedule.routeId?.destinationGhatId?.name || "Destination"}
                  </td>

                  <td>
                    {schedule.departureTime || "N/A"} -{" "}
                    {schedule.arrivalTime || "N/A"}
                  </td>

                  <td>
                    <b>{schedule.totalSeats || 0}</b> total
                    <p className="text-xs text-slate-500">
                      {schedule.onlineSeats || 0} online /{" "}
                      {schedule.offlineSeats || 0} offline /{" "}
                      {schedule.emergencySeats || 0} emergency
                    </p>
                  </td>

                  <td>{schedule.scheduleType || "DAILY"}</td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        schedule.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {schedule.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => onEdit?.(schedule)}
                        className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggleStatus(schedule._id, schedule.isActive)}
                        className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700"
                      >
                        {schedule.isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDuplicate(schedule)}
                        className="rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700"
                      >
                        Duplicate
                      </button>

                      <button
                        onClick={() => handleGenerateSlots(schedule._id)}
                        className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                      >
                        Generate 30 Days
                      </button>

                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}