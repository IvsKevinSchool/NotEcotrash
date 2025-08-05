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
    currentService: any | null;
    onSubmit: (data: ServiceFormData) => void;
    onClose: () => void;
    selectedWaste?: number;
    isWasteCollectionService?: boolean;
    isModalOpen: boolean;
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
    currentService,
    onSubmit,
    onClose,
    selectedWaste,
    isWasteCollectionService = false,
    isModalOpen
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = form;

    // Observar el cliente seleccionado, el tipo de servicio y el residuo seleccionado
    const selectedClient = watch("fk_clients");
    const selectedTypeService = watch("fk_type_services");
    const selectedWasteFromForm = watch("fk_waste");

    // Filtrar ubicaciones basándose en el cliente seleccionado
    const filteredLocations = useMemo(() => {
        if (!selectedClient || !locations) return [];
        
        // Filtrar ubicaciones que pertenecen al cliente seleccionado
        return locations.filter((location) => {
            // Si la ubicación tiene client_ids (array de IDs de clientes)
            if (location.client_ids && Array.isArray(location.client_ids)) {
                return location.client_ids.includes(selectedClient);
            }
            // Si la ubicación tiene fk_client (ID único de cliente)
            if (location.fk_client) {
                return location.fk_client === selectedClient;
            }
            // Si no hay información de cliente, mostrar todas (fallback)
            return true;
        });
    }, [selectedClient, locations]);

    // Limpiar ubicación seleccionada cuando cambie el cliente
    useEffect(() => {
        const currentLocation = form.getValues("fk_locations");
        if (currentLocation && selectedClient) {
            const locationBelongsToClient = filteredLocations.find(
                loc => loc.pk_location === currentLocation
            );
            
            if (!locationBelongsToClient) {
                setValue("fk_locations", "" as any);
            }
        } else if (!selectedClient) {
            setValue("fk_locations", "" as any);
        }
    }, [selectedClient, filteredLocations, form, setValue]);

    // Filtrar subcategorías basándose en el residuo seleccionado en el formulario
    const filteredWasteSubcategories = useMemo(() => {
        if (!selectedWasteFromForm || !wasteSubcategories) return [];
        
        const filtered = wasteSubcategories.filter((subcategory) => {
            // Considerar tanto si fk_waste es un número como si es un objeto
            const wasteId = typeof subcategory.fk_waste === 'number' 
                ? subcategory.fk_waste 
                : subcategory.fk_waste?.pk_waste;
            
            return wasteId === selectedWasteFromForm;
        });
        
        return filtered;
    }, [selectedWasteFromForm, wasteSubcategories]);

    // Limpiar subcategoría seleccionada cuando cambie el residuo
    useEffect(() => {
        const currentSubcategory = form.getValues("fk_waste_subcategory");
        if (currentSubcategory && selectedWasteFromForm) {
            const subcategoryBelongsToWaste = filteredWasteSubcategories.find(
                sub => sub.pk_waste_subcategory === currentSubcategory
            );
            
            if (!subcategoryBelongsToWaste) {
                setValue("fk_waste_subcategory", "" as any);
            }
        } else if (!selectedWasteFromForm) {
            setValue("fk_waste_subcategory", "" as any);
        }
    }, [selectedWasteFromForm, filteredWasteSubcategories, form, setValue]);

    // Establecer valor por defecto para fk_status cuando no se está editando
    useEffect(() => {
        if (!isEditing) {
            setValue("fk_status", 1);
        }
    }, [isEditing, setValue]);

    if (!isModalOpen) return null;

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
                    <div className="space-y-6">
                        {/* Primera fila: Fecha y Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Fecha Programada *</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
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
                                    disabled={!selectedClient}
                                >
                                    <option value="">
                                        {!selectedClient ? "Primero selecciona un cliente" : "Seleccionar Ubicación"}
                                    </option>
                                    {filteredLocations.map((location) => (
                                        <option key={location.pk_location} value={location.pk_location}>
                                            {location.name}
                                            {location.street_name ? ` - ${location.street_name}` : ''}
                                            {location.exterior_number ? ` ${location.exterior_number}` : ''}
                                            {location.neighborhood ? `, ${location.neighborhood}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.fk_locations && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_locations.message}</p>
                                )}
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
                                    {/* Input hidden para registrar el valor por defecto */}
                                    <input
                                        type="hidden"
                                        {...register("fk_status", { valueAsNumber: true })}
                                        value={1}
                                    />
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

                        {/* Campos de residuo solo para servicios de recolección de residuos */}
                        {selectedTypeService === 1 && (
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
                                    </div>

                                    <div>
                                        <label className="block text-green-700 mb-1 font-medium">Subcategoría de Residuo</label>
                                        <select
                                            {...register("fk_waste_subcategory", { valueAsNumber: true })}
                                            className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            disabled={!selectedWasteFromForm}
                                        >
                                            <option value="">
                                                {!selectedWasteFromForm ? "Primero selecciona un residuo" : "Seleccionar Subcategoría (Opcional)"}
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-green-100 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
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
                            ) : currentService ? (
                                'Guardar Cambios'
                            ) : (
                                'Crear Servicio'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
