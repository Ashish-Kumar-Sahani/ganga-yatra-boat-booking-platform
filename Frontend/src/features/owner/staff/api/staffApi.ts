import API from "@/api/axiosInstance";

export const getOwnerStaff = async () => {
  const res = await API.get("/staff/owner");
  return res.data;
};

export const createStaff = async (data: any) => {
  const res = await API.post("/staff", data);
  return res.data;
};

export const updateStaff = async (id: string, data: any) => {
  const res = await API.put(`/staff/${id}`, data);
  return res.data;
};

export const deleteStaff = async (id: string) => {
  const res = await API.delete(`/staff/${id}`);
  return res.data;
};