export type StaffRole = "MANAGER" | "DRIVER" | "CAPTAIN" | "HELPER";

export type StaffStatus = "ACTIVE" | "INACTIVE";

export type AssignedBoat = {
  _id: string;
  boatName: string;
  boatNumber?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  source?: "USER" | "STAFF";
  assignedBoatId?: AssignedBoat | null;
  createdAt?: string;
};