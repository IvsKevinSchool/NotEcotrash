import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import {
  getPendingServices,
  getTodayScheduledServices,
  approveService,
  rejectService,
  assignCollectorToService,
  getAvailableCollectors,
  getFilteredServices,
  ServiceWorkflow,
  Collector
} from '../api/workflowServices';

export const ManagementServicePanel = () => {
  const { user } = useAuth();
  const [pendingServices, setPendingServices] = useState<ServiceWorkflow[]>([]);
  const [todayServices, setTodayServices] = useState<ServiceWorkflow[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWorkflow[]>([]);
  const [availableCollectors, setAvailableCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    status: '',
    date_from: '',
    date_to: '',
    client: '',
    collector: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pending, today, collectors] = await Promise.all([
        getPendingServices(user?.id || 0),
        getTodayScheduledServices(user?.id || 0),
        getAvailableCollectors(user?.id || 0)
      ]);
      
      setPendingServices(pending);
      setTodayServices(today);
      setAvailableCollectors(collectors);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveService = async (serviceId: number) => {
    try {
      await approveService(serviceId);
      toast.success('Servicio aprobado correctamente');
      fetchData(); // Refrescar datos
    } catch (error) {
      toast.error('Error al aprobar el servicio');
    }
  };

  const handleRejectService = async (serviceId: number) => {
    if (window.confirm('¿Está seguro de rechazar este servicio?')) {
      try {
        await rejectService(serviceId);
        toast.success('Servicio rechazado');
        fetchData(); // Refrescar datos
      } catch (error) {
        toast.error('Error al rechazar el servicio');
      }
    }
  };

  const handleAssignCollector = async (serviceId: number, collectorId: number) => {
    try {
      await assignCollectorToService(serviceId, collectorId);
      toast.success('Collector asignado correctamente');
      fetchData(); // Refrescar datos
    } catch (error) {
      toast.error('Error al asignar collector');
    }
  };

  const handleFilterServices = async () => {
    try {
      const filterParams = {
        status: filters.status || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        client: filters.client ? parseInt(filters.client) : undefined,
        collector: filters.collector ? parseInt(filters.collector) : undefined
      };
      const filtered = await getFilteredServices(user?.id || 0, filterParams);
      setFilteredServices(filtered);
    } catch (error) {
      toast.error('Error al filtrar servicios');
    }
  };

  const renderServiceCard = (service: ServiceWorkflow, showActions = true) => (
    <div key={service.pk_services} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {service.service_number}
          </h3>
          <p className="text-sm text-gray-600">
            Cliente: {service.fk_clients?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            Ubicación: {service.fk_locations?.name || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            Fecha: {new Date(service.scheduled_date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            Tipo: {service.fk_type_services?.name || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            service.fk_status?.name === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
            service.fk_status?.name === 'Aprobado' ? 'bg-green-100 text-green-800' :
            service.fk_status?.name === 'En curso' ? 'bg-blue-100 text-blue-800' :
            service.fk_status?.name === 'Completado' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {service.fk_status?.name || 'N/A'}
          </span>
          {service.fk_collector && (
            <p className="text-xs text-gray-500 mt-1">
              Collector: {service.fk_collector.first_name} {service.fk_collector.last_name}
            </p>
          )}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {service.fk_status?.name === 'Pendiente' && (
            <>
              <button
                onClick={() => handleApproveService(service.pk_services)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Aprobar
              </button>
              <button
                onClick={() => handleRejectService(service.pk_services)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Rechazar
              </button>
            </>
          )}

          {service.fk_status?.name === 'Aprobado' && availableCollectors.length > 0 && (
            <div className="flex gap-2 items-center">
              <select
                onChange={(e) => e.target.value && handleAssignCollector(service.pk_services, parseInt(e.target.value))}
                className="px-2 py-1 border rounded text-sm"
                defaultValue=""
              >
                <option value="">Asignar Collector</option>
                {availableCollectors.map(collector => (
                  <option key={collector.pk} value={collector.pk}>
                    {collector.first_name} {collector.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Panel de Gestión de Servicios</h1>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Servicios Pendientes ({pendingServices.length})
              </button>
              <button
                onClick={() => setActiveTab('today')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'today'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Servicios de Hoy ({todayServices.length})
              </button>
              <button
                onClick={() => setActiveTab('filtered')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'filtered'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Buscar Servicios
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Servicios Pendientes de Aprobación
            </h2>
            {pendingServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay servicios pendientes
              </div>
            ) : (
              pendingServices.map(service => renderServiceCard(service))
            )}
          </div>
        )}

        {activeTab === 'today' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Servicios Programados para Hoy
            </h2>
            {todayServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay servicios programados para hoy
              </div>
            ) : (
              todayServices.map(service => renderServiceCard(service))
            )}
          </div>
        )}

        {activeTab === 'filtered' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Buscar y Filtrar Servicios
            </h2>
            
            {/* Filtros */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="En curso">En curso</option>
                    <option value="Completado">Completado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={filters.date_to}
                    onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente ID
                  </label>
                  <input
                    type="number"
                    value={filters.client}
                    onChange={(e) => setFilters({...filters, client: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ID del cliente"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={handleFilterServices}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>

            {/* Resultados */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No se encontraron servicios con los filtros aplicados
              </div>
            ) : (
              filteredServices.map(service => renderServiceCard(service, false))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
