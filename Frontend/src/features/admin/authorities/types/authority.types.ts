import type { User } from "@/features/auth/types/auth.types";

export interface AuthorityUser extends User {
  cityId?: any; // Can be string or { _id: string, name: string, state: string }
  joiningDate?: string;
}

export interface AuthorityStats {
  total: number;
  active: number;
  inactive: number;
  assignedCitiesCount: number;
}

export interface AuthorityFilters {
  search: string;
  cityId: string;
  status: string;
  department: string;
  designation: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface GetAuthoritiesResponse {
  success: boolean;
  authorities: AuthorityUser[];
  stats: AuthorityStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
