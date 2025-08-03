import api from "../../../api";
import { CollectorUserFormData, EditCollectorFormData } from "../schemas/collectorUserSchema";

const API_URL = "management/collector/";

export const getCollectorUsers = async (managementId?: number) => {
    // Si se proporciona managementId, usar endpoint filtrado, sino usar el general
    let url = API_URL;
    if (managementId) {
        url = `management/management/${managementId}/collectors/`;
    }
    const response = await api.get(url);
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

export const updateCollectorUser = async (id: number, data: EditCollectorFormData) => {
    const response = await api.patch(`management/collectors/${id}/`, {
        name: data.name,
        last_name: data.last_name,
        phone_number: data.phone_number || null, // Convierte string vacío a null
    });
    return response.data;
};

export const deleteCollectorUser = async (id: number) => {
    await api.delete(`${API_URL}${id}/`);
};