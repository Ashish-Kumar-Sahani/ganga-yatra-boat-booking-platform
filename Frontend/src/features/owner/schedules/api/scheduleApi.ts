import axiosInstance from "@/api/axiosInstance";

export const getSchedules = async () => {
  const res = await axiosInstance.get("/schedules");
  return res.data;
};

export const getMySchedules = async () => {
  const res = await axiosInstance.get("/schedules/owner");
  return res.data;
};

export const getSchedulesByRoute = async (routeId: string) => {
  const res = await axiosInstance.get(`/schedules/route/${routeId}`);
  return res.data;
};

export const createSchedule = async (data: any) => {
  const res = await axiosInstance.post("/schedules", data);
  return res.data.schedule;
};

export const updateSchedule = async (id: string, data: any) => {
  const res = await axiosInstance.put(`/schedules/${id}`, data);
  return res.data.schedule;
};

export const updateScheduleStatus = async (id: string, isActive: boolean) => {
  const res = await axiosInstance.patch(`/schedules/${id}/status`, {
    isActive,
  });
  return res.data.schedule;
};

export const deleteSchedule = async (id: string) => {
  const res = await axiosInstance.delete(`/schedules/${id}`);
  return res.data;
};