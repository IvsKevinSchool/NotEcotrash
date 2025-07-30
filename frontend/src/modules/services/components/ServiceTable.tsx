// src/components/Services/ServicesTable.tsx
import React from "react";

interface ServicesTableProps {
    services: any[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({
    services,
    isLoading,
    onEdit,
    onDelete
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Lista de Servicios</h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">N° Servicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Ubicación</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-200">
                            {services.map((service) => (
                                <tr key={service.pk_services} className="hover:bg-green-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{service.service_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {new Date(service.scheduled_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_clients.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_locations.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_status.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {service.fk_type_services.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => onEdit(service.pk_services)}
                                            className="text-green-600 hover:text-green-900 mr-3"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(service.pk_services)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
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

export default ServicesTable;