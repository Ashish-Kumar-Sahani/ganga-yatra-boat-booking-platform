export type BoatType =
  | "MANUAL"
  | "MOTOR"
  | "LUXURY"
  | "CRUISE"
  | "WATER_TAXI";

export type BoatStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export type BoatDocuments = {
  registrationNumber?: string | null;
  insuranceNumber?: string | null;
  permitNumber?: string | null;
};

export type Boat = {
  _id: string;

  ownerId: string;

  cityId:
    | string
    | {
        _id: string;
        name: string;
        state?: string;
        riverName?: string;
      };

  boatName: string;
  boatNumber: string;
  boatType: BoatType;
  capacity: number;

  image?: string | null;

  permitVerified: boolean;
  documents?: BoatDocuments;

  status: BoatStatus;
  isAvailable: boolean;

  price?: number;
  description?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type CreateBoatPayload = {
  cityId: string;
  boatName: string;
  boatNumber: string;
  boatType: BoatType;
  capacity: number;

  image?: string | null;

  documents?: BoatDocuments;
};