import type { User } from "@/features/auth/types/auth.types";
import type { Boat } from "../../boats/types/boat.types";

export type PermitType =
  | "BOAT_PERMIT"
  | "ROUTE_PERMIT"
  | "FESTIVAL_PERMIT"
  | "TEMPORARY_PERMIT"
  | "NIGHT_OPERATION_PERMIT"
  | "SAFETY_CLEARANCE";

export type PermitStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "SUSPENDED"
  | "RENEWAL_REQUIRED";

export interface Permit {
  _id: string;
  boatId: Partial<Boat>;
  ownerId: Partial<User>;
  cityId: {
    _id: string;
    name: string;
    state: string;
  };
  permitNumber: string;
  allowedRoutes: any[];
  permitType: PermitType;
  validFrom: string;
  validTill: string;
  status: PermitStatus;
  documentUrl?: string | null;
  remarks?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string;
  rejectionReason?: string;
  suspendedReason?: string;
  createdAt: string;
  updatedAt: string;
}
