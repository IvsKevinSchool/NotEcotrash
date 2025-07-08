import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api";
import { Waste, WasteFormData, WasteSubcategoryFormData } from "../types/wasteTypes";

export const useWastes = () => {
    const [wastes, setWastes] = useState<Waste[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApiError = (err: unknown, defaultMessage: string): never => {
        const error = err as { response?: { data?: { message?: string }, status?: number } };
        const message = error.response?.data?.message || defaultMessage;

        setError(message);
        toast.error(message);
        throw new Error(message);
    };

    const fetchOneWaste = async (id: string) => {
        try {
            const response = await api.get(`/waste/waste/${Number(id)}/`);
            return response.data;
        } catch (err) {
            return handleApiError(err, "Error al cargar el residuo");
        }
    };

    const fetchAllWastes = async () => {
        setLoading(true);
        try {
            const response = await api.get("/waste/waste/");
            setWastes(response.data);
            return response.data;
        } catch (err) {
            return handleApiError(err, "Error al cargar los residuos");
        } finally {
            setLoading(false);
        }
    };

    const createWaste = async (data: WasteFormData) => {
        setLoading(true);
        try {
            const response = await api.post("/waste/waste/", data);
            setWastes(prev => [...prev, response.data]);
            toast.success("Residuo creado exitosamente");
            return response.data;
        } catch (err) {
            return handleApiError(err, "Error al crear el residuo");
        } finally {
            setLoading(false);
        }
    };

    const updateWaste = async (pk: string, data: WasteFormData) => {
        setLoading(true);
        try {
            const response = await api.patch(`/waste/waste/${pk}/`, data);
            setWastes(prev =>
                prev.map(waste =>
                    String(waste.pk_waste) === String(pk) ? response.data : waste
                )
            );
            toast.success("Residuo actualizado exitosamente");
            return response.data;
        } catch (err) {
            return handleApiError(err, "Error al actualizar el residuo");
        } finally {
            setLoading(false);
        }
    };

    const createSubcategory = async (data: WasteSubcategoryFormData) => {
        setLoading(true);
        try {
            const response = await api.post("/waste-subcategories/", data);
            toast.success("Subcategoría creada exitosamente");
            return response.data;
        } catch (err) {
            return handleApiError(err, "Error al crear la subcategoría");
        } finally {
            setLoading(false);
        }
    };

    const toggleWasteStatus = async (id: string) => {
        setLoading(true);
        try {
            await api.patch(`/waste/waste/${id}/toggle-status/`);
            setWastes(prev => prev.map(waste =>
                waste.pk_waste === id ? { ...waste, is_active: !waste.is_active } : waste
            ));
            toast.success("Estado actualizado correctamente");
        } catch (err) {
            return handleApiError(err, "Error al cambiar el estado");
        } finally {
            setLoading(false);
        }
    };

    const deleteWaste = async (id: string) => {
        setLoading(true);
        try {
            await api.delete(`/waste/waste/${id}/`);
            setWastes(prev => prev.filter(waste => waste.pk_waste !== id));
            toast.warning("Residuo eliminado correctamente");
        } catch (err) {
            return handleApiError(err, "Error al eliminar el residuo");
        } finally {
            setLoading(false);
        }
    };

    return {
        wastes,
        loading,
        error,
        fetchAllWastes,
        createWaste,
        createSubcategory,
        toggleWasteStatus,
        deleteWaste,
        setWastes,
        fetchOneWaste,
        updateWaste
    };
};