import { useEffect } from "react";

import RevenueStats from "../components/RevenueStats";
import TopBoats from "../components/TopBoats";
import RoutePerformanceTable from "../components/RoutePerformance";

import {
  useReportStore,
} from "../store/reportStore";

export default function Reports() {
  const {
    report,
    loading,
    fetchReports,
  } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading || !report) {
    return <div>Loading Reports...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">
        Analytics & Reports
      </h1>

      <RevenueStats
        today={report.revenue.todayRevenue}
        weekly={report.revenue.weeklyRevenue}
        monthly={report.revenue.monthlyRevenue}
        yearly={report.revenue.yearlyRevenue}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <TopBoats
          boats={report.topBoats}
        />

        <RoutePerformanceTable
          routes={report.routes}
        />
      </div>
    </div>
  );
}