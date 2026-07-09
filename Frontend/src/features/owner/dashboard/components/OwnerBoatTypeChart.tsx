import type { OwnerDashboardData } from "../types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerBoatTypeChart({ dashboard }: Props) {
  const boatTypes = [
    { label: "Manual", value: dashboard?.boatTypes?.manual || 0 },
    { label: "Motor", value: dashboard?.boatTypes?.motor || 0 },
    { label: "Luxury", value: dashboard?.boatTypes?.luxury || 0 },
    { label: "Cruise", value: dashboard?.boatTypes?.cruise || 0 },
    { label: "Water Taxi", value: dashboard?.boatTypes?.waterTaxi || 0 },
  ];

  const total = boatTypes.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="text-lg font-bold text-blue-950">Boat Types</h2>

      <div className="mt-5 space-y-4">
        {boatTypes.map((item) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;

          return (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-600">{item.label}</span>
                <span className="font-semibold text-blue-950">
                  {item.value} ({percent}%)
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}