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

export type BookingType = "ONLINE" | "OFFLINE" | "EMERGENCY";

export interface Booking {
  _id: string;
  customerId?: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
  };

  slotId?: {
    _id: string;
    slotDate: string;
    scheduleId?: {
      _id: string;
      departureTime: string;
      arrivalTime: string;
      boatId?: {
        _id: string;
        boatName: string;
        boatNumber: string;
        capacity: number;
      };
      routeId?: {
        _id: string;
        sourceGhatId?: {
          name: string;
        };
        destinationGhatId?: {
          name: string;
        };
      };
    };
  };

  seatsBooked: number;
  totalAmount: number;

  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;

  bookingCode?: string;

  passengerName: string;
  passengerPhone: string;

  checkInStatus: "PENDING" | "CHECKED_IN" | "NO_SHOW";

  bookingType: BookingType;

  qrCode?: string | null;

  createdAt?: string;
  updatedAt?: string;
}