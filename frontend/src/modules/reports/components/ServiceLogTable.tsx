import React from 'react';
import { ServiceLog } from '../services/serviceLogService';

interface ServiceLogTableProps {
  serviceLogs: ServiceLog[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const ServiceLogTable: React.FC<ServiceLogTableProps> = ({
  serviceLogs,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return `${Number(amount).toFixed(2)} kg`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-4 bg-green-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-green-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Fecha Completado</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Ubicación</th>
              <th className="px-4 py-3 text-left">Cantidad</th>
              <th className="px-4 py-3 text-left">Recolector</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {serviceLogs.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No hay bitácoras de servicio disponibles</p>
                  </div>
                </td>
              </tr>
            ) : (
              serviceLogs.map((log) => (
                <tr key={log.pk_service_log} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-green-800">
                    #{log.pk_service_log}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {formatDate(log.completed_date)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>
                      <div className="font-medium">#{log.fk_services?.service_number}</div>
                      <div className="text-sm text-gray-500">
                        {log.fk_services?.scheduled_date && formatDate(log.fk_services.scheduled_date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>
                      <div className="font-medium">{log.fk_services?.fk_clients?.name}</div>
                      <div className="text-sm text-gray-500">{log.fk_services?.fk_clients?.legal_name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>
                      <div className="font-medium">{log.fk_services?.fk_locations?.name}</div>
                      <div className="text-sm text-gray-500">{log.fk_services?.fk_locations?.city}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatAmount(log.waste_amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div>
                      <div className="font-medium">{log.fk_user?.full_name}</div>
                      <div className="text-sm text-gray-500">@{log.fk_user?.username}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {log.fk_services?.fk_status?.name || 'Completado'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(log.pk_service_log)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(log.pk_service_log)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {log.document && (
                        <a
                          href={log.document}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Ver documento"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceLogTable;
