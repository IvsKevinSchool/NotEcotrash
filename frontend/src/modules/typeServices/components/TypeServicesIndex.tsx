import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { PlusCircleIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TypeServiceFormData, typeServiceSchema } from "../schemas/typeServiceSchema";
import {
    getTypeServices,
    getTypeService,
    createTypeService,
    updateTypeService,
    deleteTypeService,
} from "../services/typeServiceService";
import { useAuth } from "../../../context/AuthContext";

const TypeServicesIndex = () => {
    const [typeServices, setTypeServices] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentTypeService, setCurrentTypeService] = useState<any | null>(null);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TypeServiceFormData>({
        resolver: zodResolver(typeServiceSchema),
    });

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Pasar el ID del management autenticado para obtener servicios básicos + personalizados
            const data = await getTypeServices(user?.id);
            setTypeServices(data);
        } catch (error) {
            toast.error("Error fetching type services");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredTypeServices = typeServices.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const onSubmit = async (data: TypeServiceFormData) => {
        try {
            const newData = { ...data, fk_management: user?.id || data.fk_management };
            if (isEditing && currentId) {
                await updateTypeService(currentId, newData);
                toast.success("Type service updated successfully");
            } else {
                await createTypeService(newData, user?.id);
                toast.success("Type service created successfully");
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error("Error saving type service:", error);
            toast.error("Error saving type service");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const typeService = await getTypeService(id);
            setCurrentTypeService(typeService);
            reset(typeService);
            setIsEditing(true);
            setCurrentId(id);
            setIsModalOpen(true);
        } catch (error) {
            toast.error("Error fetching type service for edit");
        }
    };

    const handleDelete = (id: number) => {
        toast.success(
            <div>
                <p>¿Estás seguro de eliminar este tipo de servicio?</p>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                await deleteTypeService(id);
                                toast.success("Type service deleted successfully");
                                fetchData();
                            } catch (error) {
                                toast.error("Error deleting type service");
                            }
                        }}
                        className="px-3 py-1 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                autoClose: false,
                closeButton: false,
            }
        );
    };

    const handleCloseModal = () => {
        reset({
            name: "",
            description: ""
        });
        setCurrentTypeService(null);
        setIsEditing(false);
        setCurrentId(null);
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm">
            {/* Header del componente */}
            <div className="p-4 border-b border-green-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                        <span className="text-green-500">⚙️</span> Gestión de Tipos de Servicio
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar tipos de servicio..."
                                className="block w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => {
                                // Limpiar el formulario y estado para agregar nuevo
                                reset({
                                    name: "",
                                    description: ""
                                });
                                setCurrentTypeService(null);
                                setIsEditing(false);
                                setCurrentId(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-50">
                        <tr>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                ID
                            </th> */}
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-200">
                        {filteredTypeServices.length > 0 ? (
                            filteredTypeServices.map((service) => (
                                <tr
                                    key={service.pk_type_services}
                                    className="hover:bg-green-50"
                                >
                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                        {service.pk_type_services}
                                    </td> */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-green-900">
                                        {service.description || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {service.fk_management === null || service.fk_management === undefined ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Básico
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Personalizado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 flex gap-2">
                                        {/* Solo permitir editar y eliminar tipos servicios personalizados, osea que tengan un management_id */}
                                        {service.fk_management !== null && service.fk_management !== undefined && (
                                            <button
                                                onClick={() => handleEdit(service.pk_type_services)}
                                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                                                title="Editar"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                        {service.fk_management !== null && service.fk_management !== undefined && (
                                            <button
                                                onClick={() => handleDelete(service.pk_type_services)}
                                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                                title="Eliminar"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-green-600">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer del componente */}
            <div className="p-3 border-t border-green-100 bg-green-50 text-center">
                <p className="text-xs text-green-600">
                    ⚙️ Mostrando {filteredTypeServices.length} de {typeServices.length} registros
                </p>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
                    <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-md border border-green-300">
                        <div className="p-4 border-b border-green-200 bg-green-50/80 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-green-800">
                                    {currentTypeService ? 'Editar Tipo de Servicio' : 'Crear Nuevo Tipo de Servicio'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-green-600 hover:text-green-800 transition-colors p-1 rounded-full hover:bg-green-100"
                                    aria-label="Cerrar modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            <div className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Nombre *</label>
                                    <input
                                        type="text"
                                        {...register("name")}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.name ? "border-red-500" : "border-green-300"}`}
                                        placeholder="Nombre del tipo de servicio"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Descripción</label>
                                    <textarea
                                        {...register("description")}
                                        rows={3}
                                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Descripción del tipo de servicio (opcional)"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : currentTypeService ? (
                                        'Guardar Cambios'
                                    ) : (
                                        'Crear Tipo de Servicio'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TypeServicesIndex;