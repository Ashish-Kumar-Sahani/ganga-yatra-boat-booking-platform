import { completeTrip } from "@/features/owner/trips/api/tripApi";

type Props = {
  trips?: any[];
  onRefresh?: () => Promise<void>;
};

export default function TripTable({ trips = [], onRefresh }: Props) {
  const handleComplete = async (tripId: string) => {
    if (!confirm("Complete this trip?")) return;

    try {
      await completeTrip(tripId);
      await onRefresh?.();
      alert("Trip completed successfully");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Trip complete failed");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Trip ID</th>
              <th>Boat</th>
              <th>Route</th>
              <th>Trip Time</th>
              <th>Passengers</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No trips found
                </td>
              </tr>
            ) : (
              trips.map((trip) => {
                const route = trip.routeId;

                const startTime =
                  trip.startTime ||
                  trip.slotId?.scheduleId?.departureTime ||
                  "N/A";

                const endTime =
                  trip.endTime ||
                  trip.slotId?.scheduleId?.arrivalTime ||
                  "";

                const passengers = Number(trip.passengers || 0);
                const revenue = Number(trip.revenue || 0);
                const status = trip.tripStatus || "NOT_STARTED";

                const canComplete =
                  status !== "COMPLETED" && status !== "CANCELLED";

                return (
                  <tr key={trip._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-semibold text-blue-950">
                      {String(trip.tripCode || trip._id).slice(-8)}
                    </td>

                    <td className="font-semibold text-blue-950">
                      {trip.boatId?.boatName || "N/A"}
                      <p className="text-xs text-slate-500">
                        {trip.boatId?.boatNumber || ""}
                      </p>
                    </td>

                    <td>
                      {route?.sourceGhatId?.name || "Source"} →{" "}
                      {route?.destinationGhatId?.name || "Destination"}
                    </td>

                    <td>
                      {startTime}
                      {endTime && endTime !== "N/A" ? ` - ${endTime}` : ""}
                    </td>

                    <td>{passengers}</td>

                    <td>₹{revenue.toLocaleString("en-IN")}</td>

                    <td>
                      <StatusBadge status={status} />
                    </td>

                    <td>
                      {canComplete ? (
                        <button
                          onClick={() => handleComplete(trip._id)}
                          className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-200"
                        >
                          Complete
                        </button>
                      ) : (
                        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                          No Action
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : status === "IN_PROGRESS" || status === "STARTED"
      ? "bg-orange-100 text-orange-700"
      : status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : "bg-blue-100 text-blue-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}