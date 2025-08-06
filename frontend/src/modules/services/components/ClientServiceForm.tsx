import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { ServiceFormData, serviceSchema } from '../schemas/serviceSchema';
import { createClientService } from '../api/workflowServices';
import { getServiceFormData, Client, Location, TypeService, Waste, WasteSubcategory } from '../api/serviceFormServices';

interface ClientServiceFormProps {
  clientId?: number;
  onServiceCreated?: () => void;
}

export const ClientServiceForm = ({ clientId, onServiceCreated }: ClientServiceFormProps) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [typeServices, setTypeServices] = useState<TypeService[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [wasteSubcategories, setWasteSubcategories] = useState<WasteSubcategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      scheduled_date: "",
      fk_clients: clientId || undefined,
      fk_locations: undefined,
      fk_type_services: undefined,
      fk_waste: undefined,
      fk_waste_subcategory: undefined,
    }
  });

  const { formState: { errors, isSubmitting, isValid } } = form;
  const selectedWaste = form.watch("fk_waste");
  const selectedTypeService = form.watch("fk_type_services");
  const selectedClient = form.watch("fk_clients");

  useEffect(() => {
    fetchFormData();
  }, []);

  // Filtrar ubicaciones según el cliente seleccionado
  useEffect(() => {
    if (selectedClient) {
      // Resetear ubicación cuando cambia el cliente
      form.resetField("fk_locations");
    }
  }, [selectedClient, form]);

  // Filtrar subcategorías según el residuo seleccionado
  useEffect(() => {
    if (selectedWaste) {
      const filteredSubcategories = wasteSubcategories.filter(sub => {
        const wasteId = typeof sub.fk_waste === 'object' ? sub.fk_waste.pk_waste : sub.fk_waste;
        return wasteId === selectedWaste;
      });
      
      const currentSubcategory = form.getValues("fk_waste_subcategory");
      if (currentSubcategory) {
        const subcategoryBelongsToWaste = filteredSubcategories.find(
          sub => sub.pk_waste_subcategory === currentSubcategory
        );
        
        if (!subcategoryBelongsToWaste) {
          form.resetField("fk_waste_subcategory");
        }
      }
    } else {
      form.resetField("fk_waste_subcategory");
    }
  }, [selectedWaste, wasteSubcategories, form]);

  // Determinar si el tipo de servicio requiere información de residuos
  const isWasteCollectionService = () => {
    if (!selectedTypeService || typeServices.length === 0) return false;
    
    const selectedService = typeServices.find(service => service.pk_type_services === selectedTypeService);
    if (!selectedService) return false;
    
    const serviceName = selectedService.name.toLowerCase();
    return serviceName.includes('recolección') || 
           serviceName.includes('recoleccion') || 
           serviceName.includes('residuo') ||
           serviceName.includes('waste') ||
           serviceName.includes('collection');
  };

  // Limpiar campos de residuo cuando el tipo de servicio no sea recolección
  useEffect(() => {
    if (!isWasteCollectionService()) {
      form.resetField("fk_waste");
      form.resetField("fk_waste_subcategory");
    }
  }, [selectedTypeService, typeServices, form]);

  const fetchFormData = async () => {
    try {
      setIsFormLoading(true);
      const data = await getServiceFormData(user?.id);
      
      console.log('Datos del formulario cargados:', data); // Debug
      console.log('Usuario actual:', user); // Debug
      
      setClients(data.clients);
      setLocations(data.locations);
      setTypeServices(data.typeServices);
      setWastes(data.wastes);
      setWasteSubcategories(data.wasteSubcategories);
    } catch (error) {
      console.error('Error fetching form data:', error);
      toast.error('Error al cargar los datos del formulario');
    } finally {
      setIsFormLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setIsLoading(true);
      
      console.log('Datos originales del formulario:', data); // Debug
      
      // Transformar los datos asegurando que sean números
      const serviceData = {
        ...data,
        fk_clients: Number(data.fk_clients),
        fk_locations: Number(data.fk_locations),
        fk_type_services: Number(data.fk_type_services),
        fk_waste: data.fk_waste ? Number(data.fk_waste) : undefined,
        fk_waste_subcategory: data.fk_waste_subcategory ? Number(data.fk_waste_subcategory) : undefined,
        fk_management: user?.id
      };

      console.log('Datos transformados para envío:', serviceData); // Debug

      await createClientService(serviceData);
      toast.success('Servicio solicitado exitosamente. Está pendiente de aprobación.');
      
      // Resetear formulario
      form.reset({
        scheduled_date: "",
        fk_clients: clientId || undefined,
        fk_locations: undefined,
        fk_type_services: undefined,
        fk_waste: undefined,
        fk_waste_subcategory: undefined,
      });
      
      if (onServiceCreated) {
        onServiceCreated();
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Error al solicitar el servicio');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener ubicaciones filtradas por cliente
  const getFilteredLocations = () => {
    if (!selectedClient) return [];
    return locations.filter(location => 
      location.client_ids && location.client_ids.includes(selectedClient)
    );
  };

  // Obtener subcategorías filtradas por residuo
  const getFilteredSubcategories = () => {
    if (!selectedWaste) return [];
    return wasteSubcategories.filter(sub => {
      const wasteId = typeof sub.fk_waste === 'object' ? sub.fk_waste.pk_waste : sub.fk_waste;
      return wasteId === selectedWaste;
    });
  };

  if (isFormLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Solicitar Nuevo Servicio</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Cliente */}
        {!clientId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              {...form.register("fk_clients")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seleccionar cliente</option>
              {clients.map(client => (
                <option key={client.pk_client} value={client.pk_client}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.fk_clients && (
              <p className="text-red-500 text-sm mt-1">{errors.fk_clients.message}</p>
            )}
          </div>
        )}

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación *
          </label>
          <select
            {...form.register("fk_locations")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={!selectedClient}
          >
            <option value="">Seleccionar ubicación</option>
            {getFilteredLocations().map(location => (
              <option key={location.pk_location} value={location.pk_location}>
                {location.name} - {location.city}
              </option>
            ))}
          </select>
          {errors.fk_locations && (
            <p className="text-red-500 text-sm mt-1">{errors.fk_locations.message}</p>
          )}
          {selectedClient && getFilteredLocations().length === 0 && (
            <p className="text-yellow-600 text-sm mt-1">
              No hay ubicaciones disponibles para este cliente
            </p>
          )}
        </div>

        {/* Fecha programada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Programada *
          </label>
          <input
            type="date"
            {...form.register("scheduled_date")}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.scheduled_date && (
            <p className="text-red-500 text-sm mt-1">{errors.scheduled_date.message}</p>
          )}
        </div>

        {/* Tipo de servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Servicio *
          </label>
          <select
            {...form.register("fk_type_services")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Seleccionar tipo de servicio</option>
            {typeServices.map(typeService => (
              <option key={typeService.pk_type_services} value={typeService.pk_type_services}>
                {typeService.name}
              </option>
            ))}
          </select>
          {errors.fk_type_services && (
            <p className="text-red-500 text-sm mt-1">{errors.fk_type_services.message}</p>
          )}
        </div>

        {/* Campos de residuo (solo si es servicio de recolección) */}
        {isWasteCollectionService() && (
          <>
            {/* Tipo de residuo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Residuo
              </label>
              <select
                {...form.register("fk_waste")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Seleccionar tipo de residuo</option>
                {wastes.map(waste => (
                  <option key={waste.pk_waste} value={waste.pk_waste}>
                    {waste.name}
                  </option>
                ))}
              </select>
              {errors.fk_waste && (
                <p className="text-red-500 text-sm mt-1">{errors.fk_waste.message}</p>
              )}
            </div>

            {/* Subcategoría de residuo */}
            {selectedWaste && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategoría de Residuo
                </label>
                <select
                  {...form.register("fk_waste_subcategory")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar subcategoría</option>
                  {getFilteredSubcategories().map(subcategory => (
                    <option key={subcategory.pk_waste_subcategory} value={subcategory.pk_waste_subcategory}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                {errors.fk_waste_subcategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.fk_waste_subcategory.message}</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isValid || isSubmitting || isLoading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Enviando...' : 'Solicitar Servicio'}
          </button>
          
          <button
            type="button"
            onClick={() => form.reset()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};
