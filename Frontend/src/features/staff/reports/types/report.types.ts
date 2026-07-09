export interface RevenueSummary {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export interface TopBoat {
  boatName: string;
  totalTrips: number;
  revenue: number;
}

export interface RoutePerformance {
  routeName: string;
  bookings: number;
  revenue: number;
}

export interface ReportDashboard {
  revenue: RevenueSummary;
  topBoats: TopBoat[];
  routes: RoutePerformance[];
}