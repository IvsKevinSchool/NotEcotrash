import api from "../../../api";
import { CollectorUserFormData } from "../schemas/collectorUserSchema";

const API_URL = "management/collector/";

export const getCollectorUsers = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getCollectorUser = async (id: number) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
};

export const createCollectorUser = async (data: CollectorUserFormData, managementId: number) => {
    const response = await api.post(`management/management/${managementId}/create-collector/`, data);
    return response.data;
};

export const updateCollectorUser = async (id: number, data: CollectorUserFormData) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
};

export const deleteCollectorUser = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};