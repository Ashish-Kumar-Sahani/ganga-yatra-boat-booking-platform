export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type BookingType = "ONLINE" | "OFFLINE" | "EMERGENCY";
export type CheckInStatus = "PENDING" | "CHECKED_IN" | "NO_SHOW";

export type StaffBooking = {
  _id: string;
  bookingCode?: string;
  passengerName: string;
  passengerPhone: string;
  seatsBooked: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingType: BookingType;
  checkInStatus: CheckInStatus;
  createdAt: string;

  customerId?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };

  slotId?: {
    _id: string;
    slotDate?: string;
    scheduleId?: {
      _id: string;
      departureTime?: string;
      arrivalTime?: string;
      boatId?: {
        _id: string;
        boatName: string;
        boatNumber?: string;
      };
      routeId?: {
        _id: string;
        sourceGhatId?: {
          _id: string;
          name: string;
        };
        destinationGhatId?: {
          _id: string;
          name: string;
        };
      };
    };
  };
};