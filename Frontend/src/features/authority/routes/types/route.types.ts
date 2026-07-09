export type RouteApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface Route {
  _id: string;
  cityId: {
    _id: string;
    name: string;
    state: string;
  };
  sourceGhatId: {
    _id: string;
    name: string;
  };
  destinationGhatId: {
    _id: string;
    name: string;
  };
  distanceKm: number;
  estimatedDurationMinutes: number;
  baseFare: number;
  nightFare: number;
  weekendFare: number;
  festivalFare: number;
  approvalStatus: RouteApprovalStatus;
  isActive: boolean;
  safetyNote?: string;
  approvalNote?: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string;
  suspendedReason?: string;
  createdAt: string;
  updatedAt: string;
}
