import { AlertTriangle, CheckCircle, Navigation, Ship } from "lucide-react";
import type { LiveTrip } from "../types/liveTracking.types";

type Props = {
  trips?: LiveTrip[];
};

export default function LiveTripStats({ trips = [] }: Props) {
  const safeTrips = Array.isArray(trips) ? trips : [];

  const running = safeTrips.filter(
    (t) => t.tripStatus === "STARTED" || t.tripStatus === "IN_PROGRESS"
  ).length;

  const completed = safeTrips.filter((t) => t.tripStatus === "COMPLETED").length;
  const upcoming = safeTrips.filter((t) => t.tripStatus === "NOT_STARTED").length;
  const sos = safeTrips.filter((t) => t.sosActive).length;

  const stats = [
    { title: "Running Trips", value: running, icon: Navigation },
    { title: "Upcoming Trips", value: upcoming, icon: Ship },
    { title: "Completed", value: completed, icon: CheckCircle },
    { title: "SOS Alerts", value: sos, icon: AlertTriangle },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {item.title}
                </p>
                <h3 className="mt-2 text-3xl font-black text-blue-950">
                  {item.value}
                </h3>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <Icon size={28} className="text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}