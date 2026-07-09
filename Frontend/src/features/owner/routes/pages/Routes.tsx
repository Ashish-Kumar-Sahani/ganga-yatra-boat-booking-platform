import { useEffect } from "react";
import OwnerRouteStats from "../components/OwnerRouteStats";
import OwnerRouteTable from "../components/OwnerRouteTable";
import { useRouteStore } from "../store/routeStore";

export default function Routes() {
  const { routes, loading, fetchRoutes } = useRouteStore();

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-950">My Routes</h1>
          <p className="text-slate-500">
            Manage assigned river routes and ghat connections
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 text-white">
          Request New Route
        </button>
      </div>

      <OwnerRouteStats />

      {loading ? (
        <div className="mt-10 text-center">Loading Routes...</div>
      ) : (
        <OwnerRouteTable routes={routes} />
      )}
    </div>
  );
}