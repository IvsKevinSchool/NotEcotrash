import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { getCollectorServices, completeService, ServiceWorkflow } from '../api/workflowServices';

export const CollectorServicesPage = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingService, setCompletingService] = useState<number | null>(null);

  useEffect(() => {
    const collectorId = user?.collector?.pk_collector_user || user?.id;
    if (collectorId) {
      console.log('Collector ID detected, fetching services:', collectorId);
      fetchServices();
    } else {
      console.log('No collector ID found');
      setLoading(false);
    }
  }, [user?.collector?.pk_collector_user, user?.id]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const collectorId = user?.collector?.pk_collector_user || user?.id || 0;
      console.log('Fetching services for collector ID:', collectorId);
      const collectorServices = await getCollectorServices(collectorId);
      console.log('Received services:', collectorServices);
      setServices(collectorServices);
    } catch (error) {
      console.error('Error fetching collector services:', error);
      toast.error('Error al cargar los servicios asignados');
      // En caso de error, establecer un array vacío para que no se quede cargando indefinidamente
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteService = async (serviceId: number) => {
    if (window.confirm('¿Está seguro de marcar este servicio como completado?')) {
      try {
        setCompletingService(serviceId);
        await completeService(serviceId);
        toast.success('Servicio marcado como completado');
        fetchServices(); // Refrescar la lista
      } catch (error) {
        toast.error('Error al completar el servicio');
      } finally {
        setCompletingService(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En curso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completado':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderServiceCard = (service: ServiceWorkflow) => (
    <div key={service.pk_services} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {service.service_number}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium text-gray-600 w-20">Cliente:</span>
                <span className="text-gray-800">{service.fk_clients?.name || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-20">Fecha:</span>
                <span className="text-gray-800">{new Date(service.scheduled_date).toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-600 w-20">Tipo:</span>
                <span className="text-gray-800">{service.fk_type_services?.name || 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="font-medium text-gray-600">Ubicación:</span>
                <span className="text-gray-800">{service.fk_locations?.name || 'N/A'}</span>
                {service.fk_locations?.city && (
                  <span className="text-sm text-gray-500">{service.fk_locations.city}</span>
                )}
              </div>
              {service.fk_waste && (
                <div className="flex">
                  <span className="font-medium text-gray-600 w-20">Residuo:</span>
                  <span className="text-gray-800">{service.fk_waste?.name || 'N/A'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="ml-4 text-right">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.fk_status?.name || 'N/A')}`}>
            {service.fk_status?.name || 'N/A'}
          </span>
        </div>
      </div>

      {/* Acciones */}
      {service.fk_status?.name === 'En curso' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
              🚛 Este servicio está asignado a usted. Complete el servicio cuando termine.
            </div>
            <button
              onClick={() => handleCompleteService(service.pk_services)}
              disabled={completingService === service.pk_services}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {completingService === service.pk_services ? 'Completando...' : 'Marcar como Completado'}
            </button>
          </div>
        </div>
      )}

      {service.fk_status?.name === 'Completado' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
            ✅ Servicio completado exitosamente
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        <span>Asignado: {new Date(service.created_at).toLocaleString('es-ES')}</span>
        {service.updated_at && service.updated_at !== service.created_at && (
          <span className="ml-4">Actualizado: {new Date(service.updated_at).toLocaleString('es-ES')}</span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const todayServices = services.filter(service => {
    const serviceDate = new Date(service.scheduled_date).toDateString();
    const today = new Date().toDateString();
    return serviceDate === today;
  });

  const inProgressServices = services.filter(service => service.fk_status?.name === 'En curso');
  const completedServices = services.filter(service => service.fk_status?.name === 'Completado');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800">Servicios Asignados</h1>
          <p className="text-gray-600 mt-2">
            Gestione los servicios que tiene asignados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Servicios de Hoy</h3>
                <p className="text-3xl font-bold text-blue-600">{todayServices.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🚛</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">En Proceso</h3>
                <p className="text-3xl font-bold text-yellow-600">{inProgressServices.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Completados</h3>
                <p className="text-3xl font-bold text-green-600">{completedServices.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de servicios */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">🚛</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes servicios asignados
            </h3>
            <p className="text-gray-500">
              Los servicios que te asignen aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Todos los Servicios Asignados ({services.length})
            </h2>
            {services.map(service => renderServiceCard(service))}
          </div>
        )}
      </div>
    </div>
  );
};
