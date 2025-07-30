import { useState } from "react";
import { Location, LocationAPI, ManagementLocation } from "../types";
import api from "../../../api";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export const useLocations = () => {
    const [locations, setLocations] = useState<ManagementLocation[]>([]);
    const [data, setData] = useState<{ locations: ManagementLocation[] }>({ locations: [] });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get(`management/management/list/${user.id}/locations/`);
            setData(response.data); // Guardamos el objeto completo
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
        locations: data.locations,
        loading,
        fetchData,
        deleteLocation,
        setLocations,
    };
};