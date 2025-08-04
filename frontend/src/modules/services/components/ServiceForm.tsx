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
        console.log('Filtrando ubicaciones:', {
            selectedClient,
            totalLocations: locations?.length || 0,
            isEditing,
            currentService: currentService?.pk_service
        });
        
        if (!locations || locations.length === 0) {
            console.log('No hay ubicaciones disponibles');
            return [];
        }
        
        if (!selectedClient) {
            console.log('No hay cliente seleccionado');
            // Si no hay cliente seleccionado y estamos editando, mostrar todas las ubicaciones
            if (isEditing) {
                console.log('Modo edición: mostrando todas las ubicaciones');
                return locations;
            }
            return [];
        }
        
        // Filtrar ubicaciones que pertenecen al cliente seleccionado
<<<<<<< Updated upstream
        // Asumimos que las ubicaciones tienen una propiedad client_ids o similar
        return locations.filter((location) => {
=======
        const filtered = locations.filter((location) => {
>>>>>>> Stashed changes
            // Si la ubicación tiene client_ids (array de IDs de clientes)
            if (location.client_ids && Array.isArray(location.client_ids)) {
                const hasClient = location.client_ids.includes(selectedClient);
                console.log(`Ubicación ${location.name}: client_ids=${location.client_ids}, incluye ${selectedClient}? ${hasClient}`);
                return hasClient;
            }
<<<<<<< Updated upstream
            // Fallback: si no hay client_ids, mostrar todas (comportamiento anterior)
=======
            // Si la ubicación tiene fk_client (ID único de cliente)
            if (location.fk_client) {
                const matches = location.fk_client === selectedClient;
                console.log(`Ubicación ${location.name}: fk_client=${location.fk_client}, matches ${selectedClient}? ${matches}`);
                return matches;
            }
            // Si no hay información de cliente, mostrar todas (fallback)
            console.log(`Ubicación ${location.name}: sin información de cliente, mostrando`);
>>>>>>> Stashed changes
            return true;
        });
        
        // Si no se encontraron ubicaciones filtradas y estamos editando, mostrar todas
        if (filtered.length === 0 && isEditing) {
            console.log('No se encontraron ubicaciones filtradas en modo edición, mostrando todas');
            return locations;
        }
        
        console.log(`Ubicaciones filtradas: ${filtered.length} de ${locations.length}`);
        return filtered;
    }, [selectedClient, locations, isEditing, currentService]);

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

<<<<<<< Updated upstream
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
=======
    // Filtrar subcategorías basándose en el residuo seleccionado
    const filteredWasteSubcategories = useMemo(() => {
        console.log('Filtrando subcategorías:', {
            selectedWaste,
            totalSubcategories: wasteSubcategories?.length || 0,
            isWasteCollectionService
        });
        
        if (!selectedWaste || !wasteSubcategories || wasteSubcategories.length === 0) {
            console.log('No hay residuo seleccionado o subcategorías disponibles');
            return [];
        }
        
        const filtered = wasteSubcategories.filter((subcategory) => {
            // Extraer el ID del residuo de la subcategoría
            const wasteId = typeof subcategory.fk_waste === 'object' 
                ? subcategory.fk_waste.pk_waste 
                : subcategory.fk_waste;
            
            const matches = wasteId === selectedWaste;
            console.log(`Subcategoría ${subcategory.name || subcategory.description}: fk_waste=${wasteId}, matches ${selectedWaste}? ${matches}`);
            return matches;
        });
        
        console.log(`Subcategorías filtradas: ${filtered.length} de ${wasteSubcategories.length}`);
        return filtered;
    }, [selectedWaste, wasteSubcategories, isWasteCollectionService]);

    if (!isModalOpen) return null;

    // Debug: mostrar datos disponibles cuando se abre el modal
    console.log('ServiceForm - Datos disponibles:', {
        clients: clients?.length || 0,
        locations: locations?.length || 0,
        statuses: statuses?.length || 0,
        typeServices: typeServices?.length || 0,
        wastes: wastes?.length || 0,
        wasteSubcategories: wasteSubcategories?.length || 0,
        isEditing,
        currentService: currentService?.pk_service,
        selectedClient,
        selectedWaste,
        filteredLocations: filteredLocations?.length || 0,
        filteredWasteSubcategories: filteredWasteSubcategories?.length || 0,
        formValues: {
            fk_clients: watch("fk_clients"),
            fk_locations: watch("fk_locations"),
            fk_status: watch("fk_status"),
            fk_type_services: watch("fk_type_services"),
            fk_waste: watch("fk_waste"),
            fk_waste_subcategory: watch("fk_waste_subcategory"),
            scheduled_date: watch("scheduled_date")
        }
    });

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-4xl border border-green-300 max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-green-200 bg-green-50/80 rounded-t-lg sticky top-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-green-800">
                            {currentService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                        </h3>
                        <button
                            onClick={onClose}
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
                    {/* Debug panel temporal */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                        <p><strong>Debug Info:</strong></p>
                        <p>Modo: {isEditing ? 'Edición' : 'Creación'}</p>
                        <p>Cliente seleccionado: {watch("fk_clients") || 'Ninguno'}</p>
                        <p>Ubicación seleccionada: {watch("fk_locations") || 'Ninguna'}</p>
                        <p>Tipo de servicio: {watch("fk_type_services") || 'Ninguno'}</p>
                        <p>Residuo: {watch("fk_waste") || 'Ninguno'}</p>
                        <p>Subcategoría: {watch("fk_waste_subcategory") || 'Ninguna'}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Primera fila: Fecha y Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Fecha Programada *</label>
                                <input
                                    type="date"
                                    {...register("scheduled_date")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.scheduled_date ? "border-red-500" : "border-green-300"}`}
                                />
                                {errors.scheduled_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.scheduled_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Cliente *</label>
                                <select
                                    {...register("fk_clients", { valueAsNumber: true })}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_clients ? "border-red-500" : "border-green-300"}`}
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
                        </div>

                        {/* Segunda fila: Ubicación y Estado (condicional) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Ubicación *</label>
                                <select
                                    {...register("fk_locations", { valueAsNumber: true })}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_locations ? "border-red-500" : "border-green-300"}`}
                                >
                                    <option value="">
                                        {!selectedClient && !isEditing 
                                            ? "Primero selecciona un cliente" 
                                            : filteredLocations.length === 0 
                                                ? "No hay ubicaciones disponibles" 
                                                : "Seleccionar Ubicación"}
                                    </option>
                                    {filteredLocations.map((location) => (
                                        <option key={location.pk_location} value={location.pk_location}>
                                            {location.name} - {location.city}
                                        </option>
                                    ))}
                                </select>
                                {errors.fk_locations && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_locations.message}</p>
                                )}
                                {/* Debug info - remover en producción */}
                                <p className="text-xs text-gray-500 mt-1">
                                    Debug: {filteredLocations.length} ubicaciones disponibles
                                </p>
                            </div>

                            {/* Estado - Solo mostrar cuando se edita un servicio existente */}
                            {isEditing && (
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Estado *</label>
                                    <select
                                        {...register("fk_status", { valueAsNumber: true })}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_status ? "border-red-500" : "border-green-300"}`}
                                    >
                                        <option value="">Seleccionar Estado</option>
                                        {statuses.map((status) => (
                                            <option key={status.pk_status} value={status.pk_status}>
                                                {status.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fk_status && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fk_status.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Información del estado por defecto cuando se crea */}
                            {!isEditing && (
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Estado</label>
                                    <div className="w-full p-3 border border-green-300 rounded-lg bg-green-50 text-green-700">
                                        En progreso (por defecto)
                                    </div>
                                    <p className="text-xs text-green-600 mt-1">
                                        Los nuevos servicios se crean automáticamente en estado "En progreso"
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tercera fila: Tipo de servicio */}
                        <div>
                            <label className="block text-green-700 mb-1 font-medium">Tipo de Servicio *</label>
                            <select
                                {...register("fk_type_services", { valueAsNumber: true })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_type_services ? "border-red-500" : "border-green-300"}`}
                            >
                                <option value="">Seleccionar Tipo de Servicio</option>
                                {typeServices.map((typeService) => (
                                    <option key={typeService.pk_type_services} value={typeService.pk_type_services}>
                                        {typeService.name}
                                    </option>
                                ))}
                            </select>
                            {errors.fk_type_services && (
                                <p className="text-red-500 text-sm mt-1">{errors.fk_type_services.message}</p>
                            )}
                        </div>

                        {/* Campos de residuo solo para servicios de recolección */}
                        {isWasteCollectionService && (
                            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="text-green-800 font-medium">Información de Residuos</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-green-700 mb-1 font-medium">Tipo de Residuo *</label>
                                        <select
                                            {...register("fk_waste", { valueAsNumber: true })}
                                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_waste ? "border-red-500" : "border-green-300"}`}
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
                                        {/* Debug info - remover en producción */}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Debug: {wastes.length} tipos de residuo disponibles
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-green-700 mb-1 font-medium">Subcategoría de Residuo</label>
                                        <select
                                            {...register("fk_waste_subcategory", { valueAsNumber: true })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        >
                                            <option value="">
                                                {!selectedWaste 
                                                    ? "Primero selecciona un residuo" 
                                                    : filteredWasteSubcategories.length === 0 
                                                        ? "No hay subcategorías disponibles" 
                                                        : "Seleccionar Subcategoría (Opcional)"}
                                            </option>
                                            {filteredWasteSubcategories.map((subcategory) => (
                                                <option key={subcategory.pk_waste_subcategory} value={subcategory.pk_waste_subcategory}>
                                                    {subcategory.name || subcategory.description?.split(' ').slice(0, 4).join(' ') || `Subcategoría #${subcategory.pk_waste_subcategory}`}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.fk_waste_subcategory && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fk_waste_subcategory.message}</p>
                                        )}
                                        {/* Debug info - remover en producción */}
                                        <p className="text-xs text-gray-500 mt-1">
                                            Debug: {filteredWasteSubcategories.length} subcategorías para residuo {selectedWaste}
                                        </p>
                                    </div>
                                </div>
                            </div>
>>>>>>> Stashed changes
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