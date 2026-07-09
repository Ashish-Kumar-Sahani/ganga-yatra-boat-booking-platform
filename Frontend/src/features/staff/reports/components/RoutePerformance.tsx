import type { RoutePerformance } from "../types/report.types";

interface Props {
  routes: RoutePerformance[];
}

export default function RoutePerformanceTable({
  routes,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="text-xl font-bold mb-4">
        Route Performance
      </h2>

      <table className="w-full">
        <thead>
          <tr>
            <th>Route</th>
            <th>Bookings</th>
            <th>Revenue</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((route) => (
            <tr key={route.routeName}>
              <td>{route.routeName}</td>
              <td>{route.bookings}</td>
              <td>₹{route.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}