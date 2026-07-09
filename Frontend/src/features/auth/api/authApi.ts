import API from "@/api/axiosInstance";

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  User,
} from "../types/auth.types";

/**
 * Login User
 */
export const loginUser = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  const res = await API.post("/auth/login", data);

  return res.data;
};

/**
 * Register User
 */
export const registerUser = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const res = await API.post("/auth/register", data);

  return res.data;
};

/**
 * Current Logged In User
 */
export const getMe = async (): Promise<User> => {
  const res = await API.get("/auth/me");

  return res.data.user;
};

/**
 * Logout
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
export const forgotPassword = async (email: string) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await API.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const res = await API.post("/auth/reset-password", {
    email,
    newPassword,
  });
  return res.data;
};

/**
 * Update profile details (Name, Phone, Email)
 */
export const updateProfile = async (data: {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
}): Promise<any> => {
  const res = await API.put("/auth/profile", data);
  return res.data;
};

/**
 * Upload profile photo to Cloudinary
 */
export const updateProfileImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await API.patch("/auth/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/**
 * Change security password
 */
export const changePassword = async (data: {
  currentPassword?: string;
  newPassword?: string;
}): Promise<any> => {
  const res = await API.put("/auth/change-password", data);
  return res.data;
};

