// src/services/managementService.ts
import api from "../../../api";
import { ManagementFormValues } from "../schemas/managementSchema";
import { Management } from '../types/management';

export const ManagementService = {
    async getAll(): Promise<Management[]> {
        const response = await api.get('management/management/');
        return response.data;
    },

    async getById(id: string): Promise<Management> {
        const response = await api.get(`management/management/${id}/`);
        return response.data;
    },

    async register(data: ManagementFormValues): Promise<Management> {
        const dataToSend = {
            ...data,
            phone_number_2: data.phone_number_2 || null,
        };
        const response = await api.post('accounts/auth/register/', dataToSend);
        return response.data;
    },

    async update(id: string, data: Partial<ManagementFormValues>): Promise<Management> {
        const response = await api.patch(`management/management/${id}/`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`management/management/${id}/`);
    }
};