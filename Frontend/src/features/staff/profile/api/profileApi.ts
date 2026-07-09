import axiosInstance from "@/api/axiosInstance";
import type { UpdateProfilePayload, ProfileResponse } from "../types/profile.types";

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
  const res = await axiosInstance.put<ProfileResponse>("/auth/profile", payload);
  return res.data;
};

export const updateProfileImage = async (formData: FormData): Promise<ProfileResponse> => {
  const res = await axiosInstance.patch<ProfileResponse>("/auth/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
