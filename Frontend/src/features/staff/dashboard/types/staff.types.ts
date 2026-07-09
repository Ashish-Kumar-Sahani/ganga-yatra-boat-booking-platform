export interface StaffDashboardData {
  todayBookings: number;
  activeBoats: number;
  totalBookings: number;
  totalEarnings: number;
  weeklyBookingAnalytics: Array<{ date: string; bookings: number }>;
  recentBookings: any[];
  boatStatus: any[];
  earningsSplit: {
    online: number;
    offline: number;
    emergency: number;
  };
  notificationsCount: number;
  unreadNotifications: number;
  user: any;
  assignedBoat?: any;
  todaySchedules?: any[];
  todayBookingsCount?: number;
  attendance?: any;
}