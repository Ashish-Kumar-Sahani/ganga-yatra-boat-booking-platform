export interface CustomerBooking {
  _id: string;
  bookingCode: string;

  bookingType: "ONLINE" | "OFFLINE" | "EMERGENCY";

  bookingStatus:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  seatsBooked: number;
  totalAmount: number;

  passengerName: string;
  passengerPhone: string;

  qrCode?: string;

  createdAt: string;

  slotId: {
    _id: string;
    slotDate: string;

    scheduleId: {
      departureTime: string;
      arrivalTime: string;

      boatId: {
        boatName: string;
        boatNumber: string;
      };

      routeId: {
        sourceGhatId: {
          name: string;
        };

        destinationGhatId: {
          name: string;
        };
      };
    };
  };
}