import axiosInstance from "@/api/axiosInstance";
import type { GetAuthoritiesResponse } from "../types/authority.types";

export const getAuthorities = async (params: any): Promise<GetAuthoritiesResponse> => {
  const response = await axiosInstance.get("/admin/authorities", { params });
  return response.data;
};

export const getAuthorityById = async (id: string) => {
  const response = await axiosInstance.get(`/admin/authorities/${id}`);
  return response.data;
};

export const createAuthority = async (formData: FormData) => {
  const response = await axiosInstance.post("/admin/authorities", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateAuthority = async (id: string, formData: FormData) => {
  const response = await axiosInstance.put(`/admin/authorities/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateAuthorityStatus = async (id: string, isActive: boolean) => {
  const response = await axiosInstance.patch(`/admin/authorities/${id}/status`, { isActive });
  return response.data;
};

export const updateAuthorityPassword = async (id: string, password: string) => {
  const response = await axiosInstance.patch(`/admin/authorities/${id}/password`, { password });
  return response.data;
};

export const deleteAuthority = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/authorities/${id}`);
  return response.data;
};
