// src/components/Services/ServicesTable.tsx
import React, { useState } from "react";
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface ServicesTableProps {
    services: any[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onAdd?: () => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
    services,
    isLoading,
    onEdit,
    onDelete,
    onAdd
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    const filteredServices = services.filter(service =>
        service.service_number.toString().includes(searchTerm.toLowerCase()) ||
        service.fk_clients.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.fk_locations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.fk_status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.fk_type_services.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <span className="text-green-500">📋</span> Gestión de Servicios
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar servicios..."
                                className="block w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {onAdd && (
                            <button
                                onClick={onAdd}
                                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <PlusCircleIcon className="h-5 w-5" />
                                <span>Agregar</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                N° Servicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Ubicación
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Estado
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
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <tr key={service.pk_services} className="hover:bg-green-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                        {service.service_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {new Date(service.scheduled_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_clients.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_locations.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {service.fk_status.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_type_services.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 flex gap-2">
                                        <button
                                            onClick={() => onEdit(service.pk_services)}
                                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                                            title="Editar"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(service.pk_services)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-green-600">
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
                    📋 Mostrando {filteredServices.length} de {services.length} registros
                </p>
            </div>
        </div>
    );
};

export default ServicesTable;