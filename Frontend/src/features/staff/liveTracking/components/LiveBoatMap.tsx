import { MapPin } from "lucide-react";
import type { LiveTrip } from "../types/liveTracking.types";

type Props = {
  trips?: LiveTrip[];
};

export default function LiveBoatMap({ trips = [] }: Props) {
  const activeTrips = trips.filter(
  (trip) =>
    trip.tripStatus === "STARTED" ||
    trip.tripStatus === "IN_PROGRESS" ||
    trip.tripStatus === "NOT_STARTED"
);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-blue-950">Live Boat Tracking</h2>
      <p className="text-sm text-slate-500">
        Map integration pending. Showing active boat location cards.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeTrips.length === 0 ? (
  <div className="col-span-full rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
    No boats scheduled right now.
  </div>
      ) : (
          activeTrips.map((trip) => {
            const route = trip.routeId || trip.slotId?.scheduleId?.routeId;
            const boat = trip.boatId || trip.slotId?.scheduleId?.boatId;

            return (
              <div key={trip._id} className="rounded-2xl border p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <MapPin className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-bold text-blue-950">
                      {boat?.boatName || "Boat"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {boat?.boatNumber || ""}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-600">
                  {route?.sourceGhatId?.name || "Source"} →{" "}
                  {route?.destinationGhatId?.name || "Destination"}
                </p>

                <p className="mt-3 text-sm font-semibold text-blue-700">
                  Status: {trip.tripStatus}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Location:{" "}
                  {trip.currentLatitude && trip.currentLongitude
                    ? `${trip.currentLatitude}, ${trip.currentLongitude}`
                    : "Not updated"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}