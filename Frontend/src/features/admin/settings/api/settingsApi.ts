import axiosInstance from "@/api/axiosInstance";

export const getSettingsAdmin = async () => {
  const response = await axiosInstance.get("/settings");
  return response.data;
};

export const updateSettingsAdmin = async (data: any) => {
  const response = await axiosInstance.put("/settings", data);
  return response.data;
};
