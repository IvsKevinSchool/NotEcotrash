import api from "../../../api";

const API_URL = "client/client/"; // Reemplaza con tu URL real

export const getClientProfile = async (clientId: number) => {
    const response = await api.get(`${API_URL}${clientId}/`);
    return response.data;
};

export const updateClientProfile = async (clientId: number, data: any) => {
    const response = await api.patch(`${API_URL}${clientId}/`, data);
    return response.data;
};