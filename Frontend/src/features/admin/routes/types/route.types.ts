import type { City } from "../../cities/types/city.types";
import type { Ghat } from "../../ghats/types/ghat.types";

export interface Route {
  _id: string;
  cityId: string | City;
  sourceGhatId: string | Ghat;
  destinationGhatId: string | Ghat;
  distanceKm: number;
  estimatedDurationMinutes: number;
  baseFare: number;
  nightFare?: number;
  weekendFare?: number;
  festivalFare?: number;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isActive?: boolean;
  safetyNote?: string;
  approvalNote?: string;
}
