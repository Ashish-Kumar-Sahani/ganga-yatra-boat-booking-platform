export type ScheduleStatus = "ACTIVE" | "UPCOMING" | "COMPLETED" | "CANCELLED";

export type Schedule = {
  _id: string;
  scheduleId?: string;
  boatName: string;
  routeName: string;
  departure: string;
  arrival: string;
  status: ScheduleStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type ScheduleApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};