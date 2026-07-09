import type { BoatRoute } from "@/features/owner/routes/types/route.types";

type Props = {
  routes: BoatRoute[];
};

export default function OwnerRouteTable({ routes }: Props) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">Route</th>
            <th>From</th>
            <th>To</th>
            <th>Duration</th>
            <th>Distance</th>
            <th>Boats</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((route) => (
            <tr key={route._id} className="border-t hover:bg-slate-50">
              <td className="p-4 font-semibold text-blue-950">
                {route.routeName || "Route"}
              </td>
              <td>{route.from}</td>
              <td>{route.to}</td>
              <td>{route.duration || "-"}</td>
              <td>{route.distance || "-"}</td>
              <td>{route.boats || 0}</td>
              <td>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    route.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {route.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}