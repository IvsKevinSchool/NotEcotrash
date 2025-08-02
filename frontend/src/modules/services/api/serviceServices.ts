import { ServiceFormData } from "../schemas/serviceSchema";
import api from "../../../api";

const API_URL = "services/services/";

export const getServices = async (managementId?: number) => {
    const params = managementId ? { management_id: managementId } : {};
    const response = await api.get(API_URL, { params });
    return response.data;
};

export const getService = async (id: number) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
};

export const createService = async (data: ServiceFormData & { fk_management?: number }) => {
    const response = await api.post(API_URL, data);
    return response.data;
};

export const updateService = async (id: number, data: ServiceFormData) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
};

export const deleteService = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};