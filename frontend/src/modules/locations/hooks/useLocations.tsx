import { useState } from "react";
import { Location } from "../types";
import api from "../../../api";
import { toast } from "react-toastify";

export const useLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api("core/locations/");
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Error al cargar las ubicaciones");
        } finally {
            setLoading(false);
        }
    };

    const deleteLocation = async (id: string) => {
        try {
            const response = await api.delete(`core/locations/${id}/`);
            if (response.status === 204) {
                toast.success("Ubicación eliminada correctamente");
                await fetchData();
            }
        } catch (error) {
            toast.error("Error al eliminar la ubicación");
            console.error(error);
        }
    };

    return {
        locations,
        loading,
        fetchData,
        deleteLocation,
        setLocations,
    };
};