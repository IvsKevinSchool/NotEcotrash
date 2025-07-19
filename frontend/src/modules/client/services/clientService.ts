import api from "../../../api";
import { ClientFormData } from "../schemas/clientSchema";
const API_URL = "/client/client/";

export const getClients = async (management_id: number) => {
    const response = await api.get(`${API_URL}by-management/${management_id}/`);
    return response.data;
};

export const getClient = async (id: number) => {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
};

export const createClient = async (data: ClientFormData) => {
    const response = await api.post(API_URL, data);
    return response.data;
};

export const updateClient = async (id: number, data: ClientFormData) => {
    const response = await api.put(`${API_URL}${id}/`, data);
    return response.data;
};

export const deleteClient = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};

export const toggleClientStatus = async (id: number) => {
    const response = await api.patch(`${API_URL}${id}/toggle-status/`);
    return response.data;
};