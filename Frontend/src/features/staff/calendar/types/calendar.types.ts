export type ScheduleType = "DAILY" | "WEEKLY" | "SPECIAL";

export type StaffSchedule = {
  _id: string;

  startDate?: string;
  endDate?: string;
  specialDate?: string | null;
  weekDays?: number[];

  scheduleDate?: string;
  date?: string;
  slotDate?: string;
  createdAt?: string;

  departureTime?: string;
  arrivalTime?: string;
  startTime?: string;
  endTime?: string;

  totalSeats?: number;
  onlineSeats?: number;
  offlineSeats?: number;
  emergencySeats?: number;

  scheduleType?: ScheduleType;
  isActive?: boolean;
  status?: string;

  boatId?: {
    _id: string;
    boatName: string;
    boatNumber?: string;
    capacity?: number;
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