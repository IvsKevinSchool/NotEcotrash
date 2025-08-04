import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { RecurringService, RecurringServiceCreateData } from '../types/recurringService';
import { getServiceFormData, Client, Location, Status, TypeService, Waste, WasteSubcategory } from '../api/serviceFormServices';
import {
  getRecurringServices,
  createRecurringService,
  updateRecurringService,
  deleteRecurringService,
  pauseRecurringService,
  resumeRecurringService,
  cancelRecurringService,
  generateNextService,
  generateRecurringServices,
} from '../api/recurringServiceApi';
import RecurringServicesTable from '../components/RecurringServicesTable';
import RecurringServiceForm from '../components/RecurringServiceForm';

const RecurringServicesIndex = () => {
  const [recurringServices, setRecurringServices] = useState<RecurringService[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [typeServices, setTypeServices] = useState<TypeService[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [wasteSubcategories, setWasteSubcategories] = useState<WasteSubcategory[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<RecurringService | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { user } = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  // Cargar servicios recurrentes
  useEffect(() => {
    loadRecurringServices();
  }, [statusFilter]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const formData = await getServiceFormData();
      setClients(formData.clients);
      setLocations(formData.locations);
      setTypeServices(formData.typeServices);
      setWastes(formData.wastes);
      setWasteSubcategories(formData.wasteSubcategories);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Error al cargar los datos del formulario');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecurringServices = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      
      // Por ahora no filtraremos por usuario específico hasta que tengamos
      // la estructura completa del usuario. Los permisos se manejarán en el backend.
      
      if (statusFilter) {
        params.status = statusFilter;
      }

      const services = await getRecurringServices(params);
      setRecurringServices(services);
    } catch (error) {
      console.error('Error loading recurring services:', error);
      toast.error('Error al cargar los servicios recurrentes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = () => {
    setCurrentService(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditService = (service: RecurringService) => {
    setCurrentService(service);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: RecurringServiceCreateData) => {
    try {
      setIsLoading(true);
      // Limpiar payload: eliminar campos opcionales si son undefined o null
      const cleanedData = { ...data };
      ['fk_waste', 'fk_waste_subcategory', 'custom_days', 'end_date', 'notes'].forEach((key) => {
        if (cleanedData[key as keyof RecurringServiceCreateData] === undefined || cleanedData[key as keyof RecurringServiceCreateData] === null || cleanedData[key as keyof RecurringServiceCreateData] === '') {
          delete cleanedData[key as keyof RecurringServiceCreateData];
        }
      });
      if (isEditing && currentService) {
        await updateRecurringService(currentService.pk_recurring_service, cleanedData);
        toast.success('Servicio recurrente actualizado exitosamente');
      } else {
        await createRecurringService(cleanedData);
        toast.success('Servicio recurrente creado exitosamente');
      }
      setShowForm(false);
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error saving recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este servicio recurrente?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteRecurringService(id);
      toast.success('Servicio recurrente eliminado exitosamente');
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error deleting recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al eliminar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseService = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await pauseRecurringService(id);
      toast.success(response.message);
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error pausing recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al pausar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeService = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await resumeRecurringService(id);
      toast.success(response.message);
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error resuming recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al reanudar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelService = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar este servicio recurrente?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await cancelRecurringService(id);
      toast.success(response.message);
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error canceling recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al cancelar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateService = async (id: number) => {
    try {
      setIsLoading(true);
      // Importar dinámicamente la función de reactivación
      const { reactivateRecurringService } = await import('../api/reactivateRecurringService');
      const response = await reactivateRecurringService(id);
      toast.success('Servicio reactivado exitosamente');
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error reactivating recurring service:', error);
      const errorMessage = error.response?.data?.message || 'Error al reactivar el servicio recurrente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNextService = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await generateNextService(id);
      toast.success(`${response.message}. Servicio #${response.service.service_number} creado.`);
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error generating next service:', error);
      const errorMessage = error.response?.data?.message || 'Error al generar el próximo servicio';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAllServices = async () => {
    if (!window.confirm('¿Deseas generar todos los servicios programados para hoy?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await generateRecurringServices();
      toast.success(`Se generaron ${response.generated_services} servicios de ${response.processed_recurring_services} servicios recurrentes procesados.`);
      
      if (response.errors && response.errors.length > 0) {
        console.warn('Errores en la generación:', response.errors);
        toast.warning(`Se encontraron ${response.errors.length} errores. Revisa la consola para más detalles.`);
      }
      
      loadRecurringServices();
    } catch (error: any) {
      console.error('Error generating recurring services:', error);
      const errorMessage = error.response?.data?.message || 'Error al generar los servicios recurrentes';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormInitialData = () => {
    if (!currentService) return undefined;
    
    return {
      name: currentService.name,
      fk_client: currentService.fk_client,
      fk_location: currentService.fk_location,
      fk_type_service: currentService.fk_type_service,
      fk_waste: currentService.fk_waste || undefined,
      fk_waste_subcategory: currentService.fk_waste_subcategory || undefined,
      frequency: currentService.frequency,
      custom_days: currentService.custom_days || undefined,
      start_date: currentService.start_date,
      end_date: currentService.end_date || undefined,
      notes: currentService.notes || undefined,
    };
  };

  if (showForm) {
    return (
      <RecurringServiceForm
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
        initialData={getFormInitialData()}
        clients={clients}
        locations={locations}
        typeServices={typeServices}
        wastes={wastes}
        wasteSubcategories={wasteSubcategories}
        isLoading={isLoading}
        isEditing={isEditing}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Servicios Recurrentes</h1>
            <p className="text-gray-600 mt-2">
              Gestiona y automatiza tus servicios de recolección de residuos
            </p>
          </div>
          
          <div className="flex space-x-3">
            {user?.role === 'management' && (
              <button
                onClick={handleGenerateAllServices}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generar Servicios de Hoy
              </button>
            )}
            
            <button
              onClick={handleCreateService}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Servicio Recurrente
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="paused">Pausados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={loadRecurringServices}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Servicios Activos</p>
                <p className="text-2xl font-bold text-green-900">
                  {recurringServices.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Servicios Pausados</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {recurringServices.filter(s => s.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total de Servicios</p>
                <p className="text-2xl font-bold text-blue-900">
                  {recurringServices.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RecurringServicesTable
        services={recurringServices}
        onEdit={handleEditService}
        onDelete={handleDeleteService}
        onPause={handlePauseService}
        onResume={handleResumeService}
        onCancel={handleCancelService}
        onReactivate={handleReactivateService}
        onGenerateNext={handleGenerateNextService}
        isLoading={isLoading}
      />
    </div>
  );
};

export default RecurringServicesIndex;
