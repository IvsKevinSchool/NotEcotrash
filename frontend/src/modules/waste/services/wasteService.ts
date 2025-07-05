import axios from "axios";
import { Waste, WasteFormData, WasteSubcategoryFormData } from "../types/wasteTypes";

const API_BASE = "/api";

export const wasteService = {
    // Operaciones para Residuos
    createWaste: async (data: WasteFormData) => {
        const response = await axios.post(`${API_BASE}/wastes`, data);
        return response.data;
    },

    // Operaciones para Subcategorías
    createSubcategory: async (data: WasteSubcategoryFormData) => {
        const response = await axios.post(`${API_BASE}/waste-subcategories`, data);
        return response.data;
    },

    getWastes: async () => {
        const response = await axios.get(`${API_BASE}/wastes`);
        return response.data;
    },

    // En tu wasteService.ts
    getAll: async (): Promise<Waste[]> => {
        const response = await axios.get('/ruta-de-tu-api');
        return Array.isArray(response.data) ? response.data : []; // Forzar array
    },

    toggleStatus: async (id: string) => {
        await axios.patch(`${API_BASE}/${id}/toggle-status`);
    },

    delete: async (id: string) => {
        await axios.delete(`${API_BASE}/${id}`);
    }
};