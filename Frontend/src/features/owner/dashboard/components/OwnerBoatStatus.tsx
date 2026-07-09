import type { OwnerDashboardData } from "@/features/owner/dashboard/types/owner.types";

type Props = {
  dashboard: OwnerDashboardData | null;
};

export default function OwnerBoatStatus({ dashboard }: Props) {
  const statuses = [
    {
      label: "Approved",
      value: dashboard?.boatStatus?.approved || 0,
      className: "bg-green-100 text-green-700",
    },
    {
      label: "Pending",
      value: dashboard?.boatStatus?.pending || 0,
      className: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Rejected",
      value: dashboard?.boatStatus?.rejected || 0,
      className: "bg-red-100 text-red-700",
    },
    {
      label: "Suspended",
      value: dashboard?.boatStatus?.suspended || 0,
      className: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-blue-950">My Boats Status</h2>
        <button className="text-sm font-semibold text-blue-600">View All</button>
      </div>

      <div className="mt-5 space-y-4">
        {statuses.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b pb-4 last:border-none"
          >
            <h4 className="font-semibold text-blue-950">{item.label}</h4>

            <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${item.className}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}