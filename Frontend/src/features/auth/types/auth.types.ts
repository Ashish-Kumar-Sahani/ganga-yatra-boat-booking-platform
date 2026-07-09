export type UserRole =
  | "CUSTOMER"
  | "BOAT_OWNER"
  | "MANAGER"
  | "DRIVER"
  | "CAPTAIN"
  | "HELPER"
  | "CITY_AUTHORITY"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  cityId?: any;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  address?: string;
  city?: string;
  ownerId?: any;
  assignedBoatId?: any;
  profileImage?: string;
  department?: string;
  designation?: string;
  employeeCode?: string;
  permissions?: string[];
  walletBalance?: number;
  rewardPoints?: number;
  wishlist?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  cityId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  email: string;
  otp?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}