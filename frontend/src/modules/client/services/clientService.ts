// import api from "../../../api";
// import { ClientFormData } from "../schemas/clientSchema";

// export const getClients = async (management_id: number) => {
//     const response = await api.get(`/client/by-management/${management_id}/`);
//     return response.data;
// };

// export const getClient = async (id: number) => {
//     const response = await api.get(`/client/client/${id}/`);
//     return response.data;
// };

// export const createClient = async (data: ClientFormData) => {
//     const response = await api.post('/client/client/', data);
//     return response.data;
// };

// export const updateClient = async (id: number, data: ClientFormData) => {
//     const response = await api.put(`/client/client/${id}/`, data);
//     return response.data;
// };

// export const deleteClient = async (id: number) => {
//     await api.delete(`/client/client/${id}/`);
// };

// export const toggleClientStatus = async (id: number) => {
//     const response = await api.patch(`/client/client/${id}/toggle-status/`);
//     return response.data;
// };
import api from "../../../api";
import { ClientFormValues } from "../schemas/clientSchema";

class ClientService {
    static async getAll(id: number) {
        const response = await api.get(`/client/by-management/${id}/`);
        return response.data;
    }

    static async update(id: string, data: ClientFormValues, id_management: number) {
        const dataToSend = {
            ...data,
            fk_management: id_management
        }
        const response = await api.put(`/client/client/${id}/`, dataToSend);
        return response.data;
    }

    static async delete(id: string) {
        const response = await api.delete(`/client/client/${id}/`);
        return response.data;
    }

    static async register(data: ClientFormValues, id: number) {
        const registrationData = {
            ...data,
            management_id: id,
        }
        const response = await api.post('accounts/auth/register/', registrationData);
        return response.data;
    }

    static async getCertificatesByClient(clientId: number) {
        const response = await api.get(`/client/${clientId}/certificates/`);
        return response.data;
    }
}

export { ClientService };