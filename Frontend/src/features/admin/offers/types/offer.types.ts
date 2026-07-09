import type { City } from "../../cities/types/city.types";

export interface Offer {
  _id: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  maxDiscountAmount: number;
  minBookingAmount: number;
  validFrom: string;
  validTill: string;
  cityId?: string | City | null;
  isActive?: boolean;
}
