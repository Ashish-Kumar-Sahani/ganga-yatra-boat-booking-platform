export type RouteStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type BoatRoute = {
  _id: string;
  routeName?: string;
  from: string;
  to: string;
  distance?: string;
  duration?: string;
  boats?: number;
  status: RouteStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type RouteApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};