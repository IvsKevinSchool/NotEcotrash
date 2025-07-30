import { useState } from "react";
import { Location, LocationAPI, ManagementLocation, ClientLocation, ClientLocationsResponse } from "../types";
import api from "../../../api";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export const useLocations = () => {
    const [locations, setLocations] = useState<ClientLocation[]>([]);
    const [data, setData] = useState<{ locations: ClientLocation[] }>({ locations: [] });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchData = async () => {
        try {
            setLoading(true);
            // Usar el nuevo endpoint que obtiene todas las ubicaciones de clientes del management
            const response = await api.get<ClientLocationsResponse>(`client/management/${user.id}/all-locations/`);
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
            // Eliminar de ClientsLocations en lugar de Location directamente
            const response = await api.delete(`client/locations/${id}/`);
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