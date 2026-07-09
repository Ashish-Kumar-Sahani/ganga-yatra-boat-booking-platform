import type { User } from "@/features/auth/types/auth.types";

export type BoatVerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface BoatDocuments {
  registrationNumber?: string | null;
  insuranceNumber?: string | null;
  permitNumber?: string | null;
}

export interface Boat {
  _id: string;
  ownerId: Partial<User>;
  cityId: {
    _id: string;
    name: string;
    state: string;
    riverName: string;
  };
  boatName: string;
  boatNumber: string;
  boatType: "MANUAL" | "MOTOR" | "LUXURY" | "CRUISE" | "WATER_TAXI";
  capacity: number;
  image?: string | null;
  permitVerified: boolean;
  documents: BoatDocuments;
  status: BoatVerificationStatus;
  isAvailable: boolean;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string;
  rejectionReason?: string;
  suspendedReason?: string;
  createdAt: string;
  updatedAt: string;
}
