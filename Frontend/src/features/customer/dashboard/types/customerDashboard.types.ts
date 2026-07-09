export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type BookingType =
  | "ONLINE"
  | "OFFLINE"
  | "EMERGENCY";

export type CustomerDashboardBooking = {
  _id: string;
  bookingCode: string;
  bookingType: BookingType;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  checkInStatus?: "PENDING" | "CHECKED_IN" | "NO_SHOW";

  seatsBooked: number;
  totalAmount: number;
  passengerName?: string;
  passengerPhone?: string;
  qrCode?: string;
  createdAt: string;

  slotId?: {
    _id: string;
    slotDate: string;

    scheduleId?: {
      _id: string;
      departureTime?: string;
      arrivalTime?: string;

      boatId?: {
        _id: string;
        boatName?: string;
        boatNumber?: string;
        image?: string;
        capacity?: number;
      };

      routeId?: {
        _id: string;
        sourceGhatId?: {
          _id: string;
          name?: string;
        };
        destinationGhatId?: {
          _id: string;
          name?: string;
        };
      };
    };
  };
};

export type RecommendedBoat = {
  _id: string;
  boatName: string;
  boatNumber?: string;
  boatType?: string;
  capacity?: number;
  image?: string | null;
  rating?: number;
  price?: number;
};

export type CustomerDashboardStats = {
  upcomingBookings: number;
  totalRides: number;
  completedRides: number;
  cancelledBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
};

export type CustomerDashboardData = {
  customerName: string;
  stats: CustomerDashboardStats;
  recentBookings: CustomerDashboardBooking[];
  upcomingBooking: CustomerDashboardBooking | null;
  recommendedBoats?: RecommendedBoat[];
};