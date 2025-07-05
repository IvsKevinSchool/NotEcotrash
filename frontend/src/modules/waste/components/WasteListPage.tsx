import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { wasteService } from "../services/wasteService";
import { toast } from "react-toastify";
import { ArrowPathIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Waste {
    pk_waste: string;
    name: string;
    description: string;
    is_active: boolean;
}

export const WasteListPage = () => {
    const navigate = useNavigate();
    const [wastes, setWastes] = useState<Waste[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchWastes = async () => {
            try {
                setIsLoading(true);
                const data = await wasteService.getAll();
                setWastes(data);
            } catch (error) {
                toast.error("Error al cargar los residuos");
                console.error("Error fetching wastes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWastes();
    }, [refresh]);

    const handleToggleStatus = async (id: string) => {
        try {
            await wasteService.toggleStatus(id);
            toast.success("Estado actualizado correctamente");
            setRefresh(!refresh); // Forzar recarga de datos
        } catch (error) {
            toast.error("Error al cambiar el estado");
            console.error("Error toggling waste status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar este residuo?")) {
            try {
                await wasteService.delete(id);
                toast.success("Residuo eliminado correctamente");
                setRefresh(!refresh); // Forzar recarga de datos
            } catch (error) {
                toast.error("Error al eliminar el residuo");
                console.error("Error deleting waste:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center space-x-3">
                        <ArrowPathIcon className="h-10 w-10 text-green-600" />
                        <h1 className="text-3xl font-bold text-green-700">Gestión de Residuos</h1>
                    </div>
                    <button
                        onClick={() => navigate("/admin/wastes/add")}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        <span>Agregar Residuo</span>
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <ArrowPathIcon className="h-12 w-12 text-green-500 animate-spin" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && wastes.length === 0 && (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <ArrowPathIcon className="mx-auto h-12 w-12 text-green-400" />
                        <h3 className="mt-2 text-lg font-medium text-green-800">No hay residuos registrados</h3>
                        <p className="mt-1 text-sm text-green-600">Comienza agregando un nuevo residuo</p>
                        <button
                            onClick={() => navigate("/admin/wastes/add")}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                            Agregar Residuo
                        </button>
                    </div>
                )}

                {/* Waste Table */}
                {!isLoading && wastes.length > 0 && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {wastes.map((waste) => (
                                    <tr key={waste.pk_waste} className="hover:bg-green-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-900">{waste.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-green-700 max-w-xs truncate">{waste.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${waste.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {waste.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/waste/edit/${waste.pk_waste}`)}
                                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                                                title="Editar"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(waste.pk_waste)}
                                                className={`p-1 rounded hover:bg-blue-100 ${waste.is_active ? 'text-blue-600 hover:text-blue-900' : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                title={waste.is_active ? 'Desactivar' : 'Activar'}
                                            >
                                                <ArrowPathIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(waste.pk_waste)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                                                title="Eliminar"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};