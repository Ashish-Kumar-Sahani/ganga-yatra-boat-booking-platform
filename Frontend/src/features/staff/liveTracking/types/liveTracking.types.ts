export type TripStatus =
  | "NOT_STARTED"
  | "STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type Boat = {
  _id: string;
  boatName: string;
  boatNumber?: string;
  capacity?: number;
};

export type Ghat = {
  _id: string;
  name: string;
};

export type Route = {
  _id: string;
  sourceGhatId?: Ghat;
  destinationGhatId?: Ghat;
};
export type Schedule = {
  _id: string;
  boatId?: Boat;
  routeId?: Route;
  departureTime?: string;
  arrivalTime?: string;
  scheduleType?: "DAILY" | "WEEKLY" | "SPECIAL";
  isActive?: boolean;
  createdAt?: string;
};

export type Slot = {
  _id: string;
  scheduleId?: Schedule;
  slotDate?: string;
  status?: string;
};

export type LiveTrip = {
  _id: string;
  boatId?: Boat;
  routeId?: Route;
  slotId?: Slot;
  tripStatus: TripStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  startedAt?: string;
  completedAt?: string;
  sosActive?: boolean;
  sosReason?: string;
  passengers?: number;
  revenue?: number;
  createdAt?: string;
};