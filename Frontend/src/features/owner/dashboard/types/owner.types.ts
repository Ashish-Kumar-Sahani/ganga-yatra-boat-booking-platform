export type OwnerChartItem = {
  date: string;
  bookings?: number;
  earnings?: number;
};

export type OwnerDashboardData = {
  totalBoats?: number;
  approvedBoats?: number;
  pendingBoats?: number;
  rejectedBoats?: number;
  suspendedBoats?: number;
  availableBoats?: number;

  totalSchedules?: number;
  activeSchedules?: number;

  totalSlots?: number;
  todaySlots?: number;

  totalBookings?: number;
  todayBookings?: number;
  totalPassengers?: number;

  confirmedBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;

  onlineBookings?: number;
  offlineBookings?: number;
  emergencyBookings?: number;

  totalEarnings?: number;
  todayEarnings?: number;
  onlineEarnings?: number;
  offlineEarnings?: number;
  emergencyEarnings?: number;
  yesterdayEarnings?: number;
  thisWeekEarnings?: number;
  lastWeekEarnings?: number;
  thisMonthEarnings?: number;
  prevMonthEarnings?: number;
  thisYearEarnings?: number;
  lifetimeEarnings?: number;
  grossRevenue?: number;
  netRevenue?: number;
  refundAmount?: number;
  cancelledAmount?: number;
  averageTicketSize?: number;

  recentBookings?: any[];

  bookingChart?: OwnerChartItem[];
  earningsChart?: OwnerChartItem[];

  boatStatus?: {
    approved?: number;
    pending?: number;
    rejected?: number;
    suspended?: number;
  };

  boatTypes?: {
    manual?: number;
    motor?: number;
    luxury?: number;
    cruise?: number;
    waterTaxi?: number;
  };

  reviews?: any[];
};