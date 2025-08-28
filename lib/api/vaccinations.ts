import api from "./index";
import type { VaccinationRecord, VaccinationData } from "../types";

export const getVaccinations = async (): Promise<VaccinationRecord[]> => {
  const response = await api.get("/vaccinations");
  return response.data;
};

export const createVaccination = async (data: VaccinationData): Promise<VaccinationRecord> => {
  const response = await api.post("/vaccinations", data);
  return response.data;
};

export const updateVaccination = async (id: string, data: Partial<VaccinationData>): Promise<VaccinationRecord> => {
  const response = await api.put(`/vaccinations/${id}`, data);
  return response.data;
};

export const deleteVaccination = async (id: string): Promise<void> => {
  await api.delete(`/vaccinations/${id}`);
};
