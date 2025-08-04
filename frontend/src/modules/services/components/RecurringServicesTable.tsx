import { reactivateRecurringService } from '../api/reactivateRecurringService';
import React from 'react';
import { RecurringService } from '../types/recurringService';
import { toast } from 'react-toastify';

interface RecurringServicesTableProps {
  services: RecurringService[];
  onEdit: (service: RecurringService) => void;
  onDelete: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
  onCancel: (id: number) => void;
  onReactivate?: (id: number) => void;
  onGenerateNext: (id: number) => void;
  isLoading?: boolean;
}

const RecurringServicesTable: React.FC<RecurringServicesTableProps> = ({
  services,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onCancel,
  onReactivate,
  onGenerateNext,
  isLoading = false,
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const handleReactivate = async (id: number) => {
    try {
      await reactivateRecurringService(id);
      if (onReactivate) {
        onReactivate(id);
      }
      toast.success('Servicio reactivado exitosamente');
    } catch (error) {
      console.error('Error al reactivar el servicio:', error);
      toast.error('Error al reactivar el servicio');
    }
  };

  const canPerformAction = (service: RecurringService, action: string) => {
    switch (action) {
      case 'pause':
        return service.status === 'active';
      case 'resume':
        return service.status === 'paused';
      case 'cancel':
        return service.status !== 'cancelled';
      case 'generate':
        return service.status === 'active';
      default:
        return true;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-lg">No hay servicios recurrentes configurados</p>
        <p className="text-sm">Crea tu primer servicio recurrente para automatizar tus recolecciones</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Ubicación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Tipo de Servicio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Frecuencia
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Próxima Generación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service.pk_recurring_service} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {service.name}
                </div>
                {service.notes && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {service.notes}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {typeof service.fk_client === 'object' && service.fk_client && 'name' in service.fk_client
                    ? (service.fk_client as any).name
                    : service.fk_client_obj?.name || `Cliente #${service.fk_client}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {typeof service.fk_location === 'object' && service.fk_location && 'name' in service.fk_location
                    ? (service.fk_location as any).name
                    : service.fk_location_obj?.name || `Ubicación #${service.fk_location}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {typeof service.fk_type_service === 'object' && service.fk_type_service && 'name' in service.fk_type_service
                    ? (service.fk_type_service as any).name
                    : service.fk_type_service_obj?.name || `Tipo #${service.fk_type_service}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {service.frequency_display}
                  {service.frequency === 'custom' && service.custom_days && (
                    <span className="text-gray-500"> ({service.custom_days} días)</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(service.next_generation_date)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(service.status)}`}>
                  {service.status_display}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(service)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="Editar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {canPerformAction(service, 'generate') && (
                    <button
                      onClick={() => onGenerateNext(service.pk_recurring_service)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Generar próximo servicio"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}

                  {canPerformAction(service, 'pause') && (
                    <button
                      onClick={() => onPause(service.pk_recurring_service)}
                      className="text-yellow-600 hover:text-yellow-900 transition-colors"
                      title="Pausar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}

                  {canPerformAction(service, 'resume') && (
                    <button
                      onClick={() => onResume(service.pk_recurring_service)}
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Reanudar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}

                  {canPerformAction(service, 'cancel') && (
                    <button
                      onClick={() => onCancel(service.pk_recurring_service)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Cancelar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(service.pk_recurring_service)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Eliminar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {/* Botón reactivar si está cancelado */}
                  {service.status === 'cancelled' && (
                    <button
                      onClick={() => handleReactivate(service.pk_recurring_service)}
                      className="text-green-700 hover:text-green-900 transition-colors"
                      title="Reactivar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringServicesTable;
