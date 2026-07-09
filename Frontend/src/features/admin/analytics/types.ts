export interface AnalyticsResponse {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalPayments: number;
  totalRevenue: number;
  totalSlots: number;
  summary?: any;
  charts?: any;
  breakdown?: any;
}
