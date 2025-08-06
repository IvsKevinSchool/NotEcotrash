import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from '../../../context/AuthContext';
import ServiceForm from '../components/ServiceForm';
import { ClientServicesList } from '../components/ClientServicesList';
import { ServiceFormData, serviceSchema } from "../schemas/serviceSchema";
import { getServiceFormData, Client, Location, Status, TypeService, Waste, WasteSubcategory } from "../api/serviceFormServices";
import { createClientService } from "../api/workflowServices";

export const ClientServicesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Estados para los datos del formulario
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [typeServices, setTypeServices] = useState<TypeService[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [wasteSubcategories, setWasteSubcategories] = useState<WasteSubcategory[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      scheduled_date: "",
      fk_clients: user?.id || undefined, // Pre-seleccionar el cliente actual
      fk_locations: undefined,
      fk_status: 1,
      fk_type_services: undefined,
      fk_waste: undefined,
      fk_waste_subcategory: undefined,
    }
  });

  const selectedWaste = form.watch("fk_waste");
  const selectedTypeService = form.watch("fk_type_services");

  // Determinar si el tipo de servicio seleccionado es "Recolección de residuos"
  const isWasteCollectionService = () => {
    if (!selectedTypeService || typeServices.length === 0) return false;
    
    const selectedService = typeServices.find(service => service.pk_type_services === selectedTypeService);
    if (!selectedService) return false;
    
    const serviceName = selectedService.name.toLowerCase();
    return serviceName.includes('recolección') || 
           serviceName.includes('recoleccion') || 
           serviceName.includes('residuo') ||
           serviceName.includes('waste') ||
           serviceName.includes('collection') ||
           serviceName.includes('general'); // Agregar "general" para capturar "recolección general"
  };

  // Cargar datos del formulario
  const fetchFormData = async () => {
    try {
      setIsFormLoading(true);
      const data = await getServiceFormData(user?.id);
      
      setClients(data.clients);
      setLocations(data.locations);
      setStatuses(data.statuses);
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

  useEffect(() => {
    if (activeTab === 'create') {
      fetchFormData();
    }
  }, [activeTab, user?.id]);

  // Función para enviar el formulario
  const onSubmit = async (data: ServiceFormData) => {
    try {
      // Validación adicional para servicios de recolección
      if (isWasteCollectionService()) {
        if (!data.fk_waste) {
          toast.error("Para servicios de recolección, debe seleccionar un residuo");
          return;
        }
      }

      // Transformar los datos asegurando que sean números
      const serviceData = {
        ...data,
        fk_clients: Number(data.fk_clients),
        fk_locations: Number(data.fk_locations),
        fk_type_services: Number(data.fk_type_services),
        fk_waste: data.fk_waste ? Number(data.fk_waste) : undefined,
        fk_waste_subcategory: data.fk_waste_subcategory ? Number(data.fk_waste_subcategory) : undefined,
      };

      // Limpiar campos de residuo si no es servicio de recolección
      if (!isWasteCollectionService()) {
        delete serviceData.fk_waste;
        delete serviceData.fk_waste_subcategory;
      }

      await createClientService(serviceData);
      toast.success('Servicio solicitado exitosamente. Está pendiente de aprobación.');
      
      // Resetear formulario
      form.reset({
        scheduled_date: "",
        fk_clients: user?.id || undefined,
        fk_locations: undefined,
        fk_type_services: undefined,
        fk_waste: undefined,
        fk_waste_subcategory: undefined,
      });
      
      handleServiceCreated();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Error al solicitar el servicio');
    }
  };

  const handleServiceCreated = () => {
    // Refrescar la lista de servicios después de crear uno nuevo
    setRefreshKey(prev => prev + 1);
    // Cambiar a la pestaña de lista para ver el nuevo servicio
    setActiveTab('list');
  };

  const handleCloseForm = () => {
    setActiveTab('list');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800">Gestión de Servicios</h1>
          <p className="text-gray-600 mt-2">
            Solicite nuevos servicios y consulte el estado de sus solicitudes
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Servicios
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Solicitar Servicio
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'list' && (
          <div key={refreshKey}>
            <ClientServicesList clientId={user?.id} />
          </div>
        )}

        {activeTab === 'create' && !isFormLoading && (
          <div>
            <ServiceForm
              form={form}
              clients={clients}
              locations={locations}
              statuses={statuses}
              typeServices={typeServices}
              wastes={wastes}
              wasteSubcategories={wasteSubcategories}
              isEditing={false}
              currentService={null}
              onSubmit={onSubmit}
              onClose={handleCloseForm}
              selectedWaste={selectedWaste}
              isModalOpen={activeTab === 'create'}
              currentManagementId={user?.id || 0}
              isClientMode={true}
            />
          </div>
        )}

        {activeTab === 'create' && isFormLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando formulario...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
