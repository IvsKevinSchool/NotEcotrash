// src/components/Services/ServiceForm.tsx
import React, { useMemo, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../schemas/serviceSchema";

interface ServiceFormProps {
    form: UseFormReturn<ServiceFormData>;
    clients: any[];
    locations: any[];
    statuses: any[];
    typeServices: any[];
    wastes: any[];
    wasteSubcategories: any[];
    isEditing: boolean;
    onSubmit: (data: ServiceFormData) => void;
    onReset: () => void;
    selectedWaste?: number;
    isWasteCollectionService?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
    form,
    clients,
    locations,
    statuses,
    typeServices,
    wastes,
    wasteSubcategories,
    isEditing,
    onSubmit,
    onReset,
    selectedWaste,
    isWasteCollectionService = false,
}) => {
    const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

    // Observar el cliente seleccionado
    const selectedClient = watch("fk_clients");

    // Filtrar ubicaciones basándose en el cliente seleccionado
    const filteredLocations = useMemo(() => {
        if (!selectedClient || !locations) return [];
        
        // Filtrar ubicaciones que pertenecen al cliente seleccionado
        // Asumimos que las ubicaciones tienen una propiedad client_ids o similar
        return locations.filter((location) => {
            // Si la ubicación tiene client_ids (array de IDs de clientes)
            if (location.client_ids && Array.isArray(location.client_ids)) {
                return location.client_ids.includes(selectedClient);
            }
            // Fallback: si no hay client_ids, mostrar todas (comportamiento anterior)
            return true;
        });
    }, [selectedClient, locations]);

    // Limpiar ubicación seleccionada cuando cambie el cliente
    useEffect(() => {
        const currentLocation = form.getValues("fk_locations");
        if (currentLocation && selectedClient) {
            // Verificar si la ubicación actual pertenece al nuevo cliente seleccionado
            const locationBelongsToClient = filteredLocations.find(
                loc => loc.pk_location === currentLocation
            );
            
            // Si no pertenece, resetear la ubicación
            if (!locationBelongsToClient) {
                setValue("fk_locations", "" as any);
            }
        } else if (!selectedClient) {
            // Si no hay cliente seleccionado, limpiar ubicación
            setValue("fk_locations", "" as any);
        }
    }, [selectedClient, filteredLocations, form, setValue]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
                {isEditing ? "Editar Servicio" : "Agregar Nuevo Servicio"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Número de servicio se genera automáticamente - no mostrar en el formulario */}
                    
                    {/* Scheduled Date */}
                    <div>
                        <label className="block text-green-700 mb-1">Fecha Programada</label>
                        <input
                            type="date"
                            {...register("scheduled_date")}
                            className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        {errors.scheduled_date && (
                            <p className="text-red-500 text-sm mt-1">{errors.scheduled_date.message}</p>
                        )}
                    </div>

                    {/* Client */}
                    <div>
                        <label className="block text-green-700 mb-1">Cliente</label>
                        <select
                            {...register("fk_clients", { valueAsNumber: true })}
                            className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Seleccionar Cliente</option>
                            {clients.map((client) => (
                                <option key={client.pk_client} value={client.pk_client}>
                                    {client.name} - {client.legal_name}
                                </option>
                            ))}
                        </select>
                        {errors.fk_clients && (
                            <p className="text-red-500 text-sm mt-1">{errors.fk_clients.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-green-700 mb-1">Ubicación</label>
                        <select
                            {...register("fk_locations", { valueAsNumber: true })}
                            className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            disabled={!selectedClient}
                        >
                            <option value="">
                                {!selectedClient ? "Primero selecciona un cliente" : "Seleccionar Ubicación"}
                            </option>
                            {filteredLocations.map((location) => (
                                <option key={location.pk_location} value={location.pk_location}>
                                    {location.name} - {location.city}
                                </option>
                            ))}
                        </select>
                        {!selectedClient && (
                            <p className="text-xs text-gray-500 mt-1">
                                Las ubicaciones se mostrarán después de seleccionar un cliente
                            </p>
                        )}
                        {errors.fk_locations && (
                            <p className="text-red-500 text-sm mt-1">{errors.fk_locations.message}</p>
                        )}
                    </div>

                    {/* Type Service */}
                    <div>
                        <label className="block text-green-700 mb-1">Tipo de Servicio</label>
                        <select
                            {...register("fk_type_services", { valueAsNumber: true })}
                            className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="">Seleccionar Tipo</option>
                            {typeServices.map((type) => (
                                <option key={type.pk_type_services} value={type.pk_type_services}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors.fk_type_services && (
                            <p className="text-red-500 text-sm mt-1">{errors.fk_type_services.message}</p>
                        )}
                    </div>

                    {/* Waste - Solo mostrar si es servicio de recolección */}
                    {isWasteCollectionService && (
                        <div>
                            <label className="block text-green-700 mb-1">Residuo</label>
                            <select
                                {...register("fk_waste", { valueAsNumber: true })}
                                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Seleccionar Residuo</option>
                                {wastes.map((waste) => (
                                    <option key={waste.pk_waste} value={waste.pk_waste}>
                                        {waste.name}
                                    </option>
                                ))}
                            </select>
                            {errors.fk_waste && (
                                <p className="text-red-500 text-sm mt-1">{errors.fk_waste.message}</p>
                            )}
                        </div>
                    )}

                    {/* Waste Subcategory - Solo mostrar si es servicio de recolección */}
                    {isWasteCollectionService && (
                        <div>
                            <label className="block text-green-700 mb-1">Subcategoría de Residuo</label>
                            <select
                                {...register("fk_waste_subcategory", { valueAsNumber: true })}
                                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                disabled={!selectedWaste}
                            >
                                <option value="">Seleccionar Subcategoría</option>
                                {wasteSubcategories
                                    .filter(sub => {
                                        // Manejar tanto el caso donde fk_waste es número como objeto
                                        const wasteId = typeof sub.fk_waste === 'object' 
                                            ? sub.fk_waste.pk_waste 
                                            : sub.fk_waste;
                                        return wasteId === selectedWaste;
                                    })
                                    .map((subcategory) => (
                                        <option key={subcategory.pk_waste_subcategory} value={subcategory.pk_waste_subcategory}>
                                            {subcategory.name || subcategory.description?.split(' ').slice(0, 4).join(' ') || `Subcategoría #${subcategory.pk_waste_subcategory}`}
                                        </option>
                                    ))}
                            </select>
                            {errors.fk_waste_subcategory && (
                                <p className="text-red-500 text-sm mt-1">{errors.fk_waste_subcategory.message}</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        {isEditing ? "Actualizar" : "Guardar"}
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ServiceForm;