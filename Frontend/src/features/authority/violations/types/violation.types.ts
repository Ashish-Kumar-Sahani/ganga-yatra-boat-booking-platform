export type ViolationType =
  | "OVER_CAPACITY"
  | "INVALID_PERMIT"
  | "UNSAFE_OPERATION"
  | "ROUTE_VIOLATION"
  | "NIGHT_OPERATION_WITHOUT_PERMISSION"
  | "DOCUMENT_EXPIRED"
  | "STAFF_LICENSE_INVALID"
  | "CUSTOMER_COMPLAINT"
  | "EMERGENCY_RULE_BREACH";

export type ViolationSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ViolationStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "PENALTY_ISSUED" | "CLOSED";

export interface Violation {
  _id: string;
  boatId?: {
    _id: string;
    boatName: string;
    boatNumber: string;
  } | null;
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  routeId?: {
    _id: string;
    sourceGhatId?: { name: string };
    destinationGhatId?: { name: string };
  } | null;
  cityId: string;
  violationType: ViolationType;
  description: string;
  severity: ViolationSeverity;
  status: ViolationStatus;
  penaltyAmount: number;
  penaltyPaid: boolean;
  reportedBy: string;
  resolvedBy?: {
    _id: string;
    name: string;
  } | null;
  resolvedAt?: string | null;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}
