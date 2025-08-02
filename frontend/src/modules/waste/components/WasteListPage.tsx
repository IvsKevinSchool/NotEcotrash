import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWastes } from "../hooks/useWastes";
import { ArrowPathIcon, PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

export const WasteListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { wastes, loading, error, fetchAllWastes, toggleWasteStatus, deleteWaste } = useWastes();

    useEffect(() => {
        fetchAllWastes(user.id);
    }, []);

    const handleToggleStatus = async (id: string) => {
        try {
            await toggleWasteStatus(id);
            // El toast se maneja dentro del hook
        } catch {
            // El error ya se maneja en el hook
        }
    };

    const handleDelete = (id: string) => {
        toast(
            <div>
                <p>¿Estás seguro de eliminar esta ubicación?</p>
                <div className="flex gap-2 justify-end mt-2">
                    <button
                        onClick={() => {
                            deleteWaste(id);
                            toast.dismiss();
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-300 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
                draggable: false,
                closeOnClick: false,
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                    <ArrowPathIcon className="h-10 w-10 text-green-600" />
                    <h1 className="text-3xl font-bold text-green-700">Gestión de Residuos</h1>
                </div>
                <button
                    onClick={() => navigate("/management/wastes/add")}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Agregar Residuo</span>
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <ArrowPathIcon className="h-12 w-12 text-green-500 animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && wastes.length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                    <ArrowPathIcon className="mx-auto h-12 w-12 text-green-400" />
                    <h3 className="mt-2 text-lg font-medium text-green-800">No hay residuos registrados</h3>
                    <p className="mt-1 text-sm text-green-600">Comienza agregando un nuevo residuo</p>
                    <button
                        onClick={() => navigate("/management/wastes/add")}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Agregar Residuo
                    </button>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => fetchAllWastes(user.id)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Waste Table */}
            {!loading && wastes.length > 0 && (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Descripción
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Estado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-200">
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
                                            onClick={() => navigate(`/management/wastes/edit/${waste.pk_waste}`)}
                                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                                            title="Editar"
                                        >
                                            <PencilIcon className="h-5 w-5" />
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
    );
};