import api from "../../../api";
import { TypeServiceFormData } from "../schemas/typeServiceSchema";

const API_URL = "services/typeServices/";

export const getTypeServices = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

export const getTypeService = async (id: number) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
};

export const createTypeService = async (data: TypeServiceFormData) => {
    const response = await api.post(API_URL, data);
    return response.data;
};

export const updateTypeService = async (id: number, data: TypeServiceFormData) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
};

export const deleteTypeService = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};