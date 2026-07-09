import StaffHero from "./StaffHero";
import StaffCharts from "./StaffCharts";
import StaffQuickActions from "./StaffQuickActions";
import StaffBoatStatus from "./StaffBoatStatus";
import StaffStats from "./StaffStats";
import StaffRecentBookings from "./StaffRecentBookings";
import type { StaffDashboardData } from "../types/staff.types";

interface Props {
  data: StaffDashboardData;
}

export default function ManagerDashboard({ data }: Props) {
  return (
    <div className="space-y-6">
      <StaffHero />
      
      {/* Real Stats cards */}
      <StaffStats data={data} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StaffCharts analytics={data.weeklyBookingAnalytics || []} />
        </div>
        <StaffQuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Bookings */}
        <StaffRecentBookings bookings={data.recentBookings || []} />

        {/* Boat Status */}
        <StaffBoatStatus boats={data.boatStatus || []} />

        {/* Breakdown Summary */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-blue-50/50 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-5">Earnings Split</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center rounded-2xl bg-green-50/30 border border-green-50 p-4">
                <span className="text-sm font-semibold text-slate-500">Online Bookings</span>
                <span className="font-black text-green-700 text-lg">₹{Number(data.earningsSplit?.online || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center rounded-2xl bg-blue-50/30 border border-blue-50 p-4">
                <span className="text-sm font-semibold text-slate-500">Offline Cash</span>
                <span className="font-black text-blue-700 text-lg">₹{Number(data.earningsSplit?.offline || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center rounded-2xl bg-orange-50/30 border border-orange-50/50 p-4">
                <span className="text-sm font-semibold text-slate-500">Emergency Bookings</span>
                <span className="font-black text-orange-700 text-lg">₹{Number(data.earningsSplit?.emergency || 0).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
