import { CheckCircle, Clock, Navigation, XCircle } from "lucide-react";

type Props = {
  trips?: any[];
};

export default function TripStats({ trips = [] }: Props) {
  const running = trips.filter(
    (trip) =>
      trip.tripStatus === "STARTED" || trip.tripStatus === "IN_PROGRESS"
  ).length;

  const completed = trips.filter(
    (trip) => trip.tripStatus === "COMPLETED"
  ).length;

  const cancelled = trips.filter(
    (trip) => trip.tripStatus === "CANCELLED"
  ).length;

  const upcoming = trips.filter(
    (trip) => trip.tripStatus === "NOT_STARTED"
  ).length;

  const stats = [
    { title: "Running Trips", value: running, icon: Navigation },
    { title: "Upcoming Trips", value: upcoming, icon: Clock },
    { title: "Completed", value: completed, icon: CheckCircle },
    { title: "Cancelled", value: cancelled, icon: XCircle },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500">{item.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-blue-950">
                  {item.value}
                </h3>
              </div>

              <Icon size={30} className="text-blue-600" />
            </div>
          </div>
        );
      })}
    </div>
  );
}