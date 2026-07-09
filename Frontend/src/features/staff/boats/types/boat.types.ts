export type StaffBoat = {
  _id: string;
  boatName: string;
  boatNumber: string;
  boatType: "MANUAL" | "MOTOR" | "LUXURY" | "CRUISE" | "WATER_TAXI";
  capacity: number;
  image?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isAvailable: boolean;
  cityId?: {
    _id: string;
    name: string;
    state?: string;
    riverName?: string;
  };
};