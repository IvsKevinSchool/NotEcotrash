import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { ServiceWorkflow, getClientServices } from '../api/workflowServices';
import { getServices } from '../api/serviceServices';

interface ClientServicesListProps {
  clientId?: number;
}

export const ClientServicesList = ({ clientId }: ClientServicesListProps) => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, [user?.id, clientId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      if (clientId) {
        // Si hay clientId específico, usar la nueva API para obtener servicios del cliente
        const clientServices = await getClientServices(clientId);
        setServices(clientServices);
      } else {
        // Si no hay clientId, obtener todos los servicios del management (fallback)
        const allServices = await getServices(user?.id);
        setServices(allServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredServices = () => {
    if (filter === 'all') return services;
    return services.filter(service => service.fk_status?.name === filter);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Aprobado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'En curso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderServiceCard = (service: ServiceWorkflow) => (
    <div key={service.pk_services} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {service.service_number}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Cliente:</span> {service.fk_clients?.name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Ubicación:</span> {service.fk_locations?.name || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Fecha:</span> {new Date(service.scheduled_date).toLocaleDateString('es-ES')}
            </div>
            <div>
              <span className="font-medium">Tipo:</span> {service.fk_type_services?.name || 'N/A'}
            </div>
            {service.fk_waste && (
              <div>
                <span className="font-medium">Residuo:</span> {service.fk_waste?.name || 'N/A'}
              </div>
            )}
            {service.fk_collector && (
              <div>
                <span className="font-medium">Recolector:</span> {service.fk_collector.first_name} {service.fk_collector.last_name}
              </div>
            )}
          </div>
        </div>
        
        <div className="ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.fk_status?.name || 'N/A')}`}>
            {service.fk_status?.name || 'N/A'}
          </span>
        </div>
      </div>

      {/* Información adicional basada en el estado */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        {service.fk_status?.name === 'Pendiente' && (
          <p className="text-sm text-yellow-700">
            📋 Su servicio está pendiente de aprobación por parte del equipo de gestión.
          </p>
        )}
        {service.fk_status?.name === 'Aprobado' && (
          <p className="text-sm text-green-700">
            ✅ Su servicio ha sido aprobado y está en proceso de asignación de recolector.
          </p>
        )}
        {service.fk_status?.name === 'En curso' && (
          <p className="text-sm text-blue-700">
            🚛 Su servicio está en curso. El recolector {service.fk_collector?.first_name} {service.fk_collector?.last_name} se encargará del servicio.
          </p>
        )}
        {service.fk_status?.name === 'Completado' && (
          <p className="text-sm text-gray-700">
            ✅ Su servicio ha sido completado exitosamente.
          </p>
        )}
        {service.fk_status?.name === 'Cancelado' && (
          <p className="text-sm text-red-700">
            ❌ Su servicio ha sido cancelado. Contacte con soporte para más información.
          </p>
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <span>Creado: {new Date(service.created_at).toLocaleString('es-ES')}</span>
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

  const filteredServices = getFilteredServices();

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-green-800">
          {clientId ? 'Mis Servicios' : 'Servicios de Clientes'}
        </h2>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="En curso">En curso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['Pendiente', 'Aprobado', 'En curso', 'Completado', 'Cancelado'].map(status => {
          const count = services.filter(s => s.fk_status?.name === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{count}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          );
        })}
      </div>

      {/* Lista de servicios */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl text-gray-300 mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No hay servicios registrados' : `No hay servicios con estado "${filter}"`}
          </h3>
          <p className="text-gray-500">
            {clientId 
              ? 'Cuando solicite servicios, aparecerán aquí.' 
              : 'Los servicios solicitados por clientes aparecerán aquí.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map(service => renderServiceCard(service))}
        </div>
      )}
    </div>
  );
};
