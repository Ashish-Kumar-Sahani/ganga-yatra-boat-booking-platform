export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type BookingType = "ONLINE" | "OFFLINE" | "EMERGENCY";

export type PaymentBoat = {
  _id: string;
  boatName: string;
  boatNumber?: string;
};

export type PaymentGhat = {
  _id: string;
  name: string;
};

export type PaymentRoute = {
  _id: string;
  sourceGhatId?: PaymentGhat;
  destinationGhatId?: PaymentGhat;
};

export type PaymentSchedule = {
  _id: string;
  boatId?: PaymentBoat;
  routeId?: PaymentRoute;
  departureTime?: string;
  arrivalTime?: string;
};

export type PaymentSlot = {
  _id: string;
  scheduleId?: PaymentSchedule;
};

export type StaffPaymentBooking = {
  _id: string;
  bookingCode?: string;
  passengerName?: string;
  passengerPhone?: string;
  seatsBooked: number;
  totalAmount: number;
  bookingType: BookingType;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  slotId?: PaymentSlot;
  createdAt?: string;
};