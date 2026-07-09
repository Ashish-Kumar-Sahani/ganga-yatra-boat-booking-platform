import axiosInstance from "@/api/axiosInstance";
import type { Offer } from "../types/offer.types";

export const getOffers = async (): Promise<Offer[]> => {
  const res = await axiosInstance.get<Offer[]>("/offers");
  return res.data;
};

export const createOffer = async (offerData: Partial<Offer>): Promise<Offer> => {
  const res = await axiosInstance.post("/offers", offerData);
  return res.data.offer;
};

export const updateOffer = async (id: string, offerData: Partial<Offer>): Promise<Offer> => {
  const res = await axiosInstance.put(`/offers/${id}`, offerData);
  return res.data.offer;
};

export const deleteOffer = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/offers/${id}`);
};
