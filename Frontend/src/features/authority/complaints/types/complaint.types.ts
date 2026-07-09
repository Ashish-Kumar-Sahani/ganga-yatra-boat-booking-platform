export type ComplaintType =
  | "SAFETY"
  | "OVERCHARGING"
  | "STAFF_BEHAVIOR"
  | "BOAT_CONDITION"
  | "ROUTE_PROBLEM"
  | "PAYMENT"
  | "EMERGENCY";

export type ComplaintStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "REJECTED";

export interface Complaint {
  _id: string;
  boatId?: {
    _id: string;
    boatName: string;
    boatNumber: string;
  } | null;
  routeId?: {
    _id: string;
    sourceGhatId?: { name: string };
    destinationGhatId?: { name: string };
  } | null;
  cityId: string;
  customerId?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  name: string;
  phone: string;
  complaintType: ComplaintType;
  description: string;
  status: ComplaintStatus;
  authorityNote?: string;
  linkedViolationId?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
