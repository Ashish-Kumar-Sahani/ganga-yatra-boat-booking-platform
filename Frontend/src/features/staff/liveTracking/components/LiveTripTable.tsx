import type { LiveTrip } from "../types/liveTracking.types";

type Props = {
  trips?: LiveTrip[];
};

export default function LiveTripTable({ trips = [] }: Props) {
  const safeTrips = Array.isArray(trips) ? trips : [];

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-4">Boat</th>
              <th>Route</th>
              <th>Time</th>
              <th>Passengers</th>
              <th>Location</th>
              <th>Status</th>
              <th>SOS</th>
            </tr>
          </thead>

          <tbody>
            {safeTrips.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No live trips found.
                </td>
              </tr>
            ) : (
              safeTrips.map((trip) => {
                const route = trip.routeId || trip.slotId?.scheduleId?.routeId;
                const boat = trip.boatId || trip.slotId?.scheduleId?.boatId;
                const schedule = trip.slotId?.scheduleId;

                return (
                  <tr key={trip._id} className="border-t hover:bg-slate-50">
                    <td className="p-4 font-bold text-blue-950">
                      {boat?.boatName || "N/A"}
                      <p className="text-xs text-slate-500">
                        {boat?.boatNumber || ""}
                      </p>
                    </td>

                    <td>
                      {route?.sourceGhatId?.name || "Source"} →{" "}
                      {route?.destinationGhatId?.name || "Destination"}
                    </td>

                    <td>
                      {schedule?.departureTime || "N/A"} -{" "}
                      {schedule?.arrivalTime || "N/A"}
                    </td>

                    <td>{trip.passengers || 0}</td>

                    <td>
                      {trip.currentLatitude && trip.currentLongitude ? (
                        <span>
                          {trip.currentLatitude}, {trip.currentLongitude}
                        </span>
                      ) : (
                        "Location not updated"
                      )}
                    </td>

                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          trip.tripStatus === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : trip.tripStatus === "STARTED" ||
                              trip.tripStatus === "IN_PROGRESS"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {trip.tripStatus}
                      </span>
                    </td>

                    <td>
                      {trip.sosActive ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          Normal
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