import API from "@/api/axiosInstance";

export const getOwnerTrips = async () => {
  const res = await API.get("/trips/owner");
  return res.data;
};

export const startTrip = async (data: {
  boatId: string;
  routeId: string;
  slotId: string;
  latitude?: number;
  longitude?: number;
}) => {
  const res = await API.post("/trips/start", data);
  return res.data;
};

export const updateTripLocation = async (data: {
  tripId: string;
  latitude: number;
  longitude: number;
}) => {
  const res = await API.patch("/trips/location", data);
  return res.data;
};

export const completeTrip = async (tripId: string) => {
  const res = await API.patch(`/trips/${tripId}/complete`);
  return res.data;
};

export const cancelTrip = async (tripId: string) => {
  const res = await API.patch(`/trips/${tripId}/cancel`);
  return res.data;
};

export const activateSOS = async (tripId: string, reason: string) => {
  const res = await API.patch(`/trips/${tripId}/sos`, { reason });
  return res.data;
};

export const getLiveTrip = async (tripId: string) => {
  const res = await API.get(`/trips/${tripId}`);
  return res.data;
};