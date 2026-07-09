export type SlotStatus = "OPEN" | "FULL" | "CANCELLED" | "EXPIRED";
export type Slot = {
  _id: string;
  slotDate: string;
  totalSeats: number;

  onlineSeats: number;
  offlineSeats: number;
  emergencySeats: number;

  bookedOnlineSeats: number;
  bookedOfflineSeats: number;
  bookedEmergencySeats: number;

  status: SlotStatus;

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

  createdAt?: string;
  updatedAt?: string;
};
export type SlotApiResponse<T> = {
  success?: boolean;
  message?: string;
  data: T;
};
export type MonthlySlotStatus =
  | "AVAILABLE"
  | "LIMITED"
  | "FULL"
  | "NO_SLOT";

export type MonthlySlotAvailability = {
  date: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  status: MonthlySlotStatus;
  slots: any[];
};