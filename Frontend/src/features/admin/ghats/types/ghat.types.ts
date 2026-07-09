import type { City } from "../../cities/types/city.types";

export interface Ghat {
  _id: string;
  cityId: string | City;
  name: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  isActive?: boolean;
}
