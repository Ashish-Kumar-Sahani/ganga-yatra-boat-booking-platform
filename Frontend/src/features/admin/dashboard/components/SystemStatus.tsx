import { useAdminDashboardStore } from "../store/dashboardStore";

export default function SystemStatus() {
  const data = useAdminDashboardStore((state) => state.data);
  const loading = useAdminDashboardStore((state) => state.loading);

  if (loading || !data) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow h-[220px] animate-pulse flex items-center justify-center text-slate-400">
        Loading system status...
      </div>
    );
  }

  const { systemHealth } = data;

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="font-bold text-blue-950">System Status</h2>

      <div className="mt-5 space-y-4 text-sm font-semibold text-slate-600">
        <div className="flex justify-between border-b pb-2">
          <span>Server API</span>
          <span className="text-green-600 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500 inline-block"></span>
            Online ({formatUptime(systemHealth.uptime)} Up)
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span>Database</span>
          <span className={`${systemHealth.databaseStatus === "CONNECTED" ? "text-green-600" : "text-red-600"} flex items-center gap-1.5`}>
            <span className={`h-2.5 w-2.5 rounded-full ${systemHealth.databaseStatus === "CONNECTED" ? "bg-green-500" : "bg-red-500"} inline-block`}></span>
            {systemHealth.databaseStatus === "CONNECTED" ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span>CPU Load</span>
          <span className="text-blue-600">{systemHealth.cpuUsage}%</span>
        </div>

        <div className="flex justify-between">
          <span>RAM Usage</span>
          <span className="text-blue-600">{systemHealth.memoryUsage}%</span>
        </div>
      </div>
    </div>
  );
}