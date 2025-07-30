import api from "../../../api";
import { ClientFormData } from "../schemas/clientSchema";

export const getClients = async (management_id: number) => {
    const response = await api.get(`/client/by-management/${management_id}/`);
    return response.data;
};

export const getClient = async (id: number) => {
    const response = await api.get(`/client/client/${id}/`);
    return response.data;
};

export const createClient = async (data: ClientFormData) => {
    const response = await api.post('/client/client/', data);
    return response.data;
};

export const updateClient = async (id: number, data: ClientFormData) => {
    const response = await api.put(`/client/client/${id}/`, data);
    return response.data;
};

export const deleteClient = async (id: number) => {
    await api.delete(`/client/client/${id}/`);
};

export const toggleClientStatus = async (id: number) => {
    // Primero obtener el cliente actual para conocer su estado
    const client = await getClient(id);
    // Cambiar el estado y actualizar
    const response = await api.put(`/client/client/${id}/`, {
        ...client,
        is_active: !client.is_active
    });
    return response.data;
};