import type { User } from "@/features/auth/types/auth.types";

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  city?: string;
  address?: string;
}

export interface ProfileResponse {
  message: string;
  user: User;
}
