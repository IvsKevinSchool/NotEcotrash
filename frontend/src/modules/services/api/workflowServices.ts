import api from '../../../api';

// Interfaces para el workflow de servicios
export interface ServiceWorkflow {
  pk_services: number;
  service_number: string;
  scheduled_date: string;
  fk_clients: any;
  fk_locations: any;
  fk_status: any;
  fk_type_services: any;
  fk_waste?: any;
  fk_waste_subcategory?: any;
  fk_collector?: any;
  created_at: string;
  updated_at: string;
}

export interface Collector {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

// API para obtener servicios pendientes (Management)
export const getPendingServices = async (managementId: number): Promise<ServiceWorkflow[]> => {
  const response = await api.get(`services/management/${managementId}/pending-services/`);
  return response.data;
};

// API para aprobar un servicio (Management)
export const approveService = async (serviceId: number): Promise<ServiceWorkflow> => {
  const response = await api.patch(`services/services/${serviceId}/approve/`);
  return response.data;
};

// API para rechazar un servicio (Management)
export const rejectService = async (serviceId: number): Promise<ServiceWorkflow> => {
  const response = await api.patch(`services/services/${serviceId}/reject/`);
  return response.data;
};

// API para obtener servicios programados para hoy (Management)
export const getTodayScheduledServices = async (managementId: number): Promise<ServiceWorkflow[]> => {
  const response = await api.get(`services/management/${managementId}/today-services/`);
  return response.data;
};

// API para asignar collector a un servicio (Management)
export const assignCollectorToService = async (serviceId: number, collectorId: number): Promise<ServiceWorkflow> => {
  const response = await api.patch(`services/services/${serviceId}/assign-collector/`, {
    collector_id: collectorId
  });
  return response.data;
};

// API para obtener collectors disponibles (Management)
export const getAvailableCollectors = async (managementId: number): Promise<Collector[]> => {
  const response = await api.get(`services/management/${managementId}/available-collectors/`);
  return response.data;
};

// API para obtener servicios de un collector (Collector)
export const getCollectorServices = async (collectorId: number): Promise<ServiceWorkflow[]> => {
  const response = await api.get(`services/collector/${collectorId}/services/`);
  return response.data;
};

// API para completar un servicio (Collector)
export const completeService = async (serviceId: number): Promise<ServiceWorkflow> => {
  const response = await api.patch(`services/services/${serviceId}/complete/`);
  return response.data;
};

// API para obtener servicios filtrados (Management)
export const getFilteredServices = async (managementId: number, filters?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  client?: number;
  collector?: number;
}): Promise<ServiceWorkflow[]> => {
  let url = `services/management/${managementId}/filtered-services/`;
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
  }
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await api.get(url);
  return response.data;
};

// API para crear servicio desde cliente (Client)
export const createClientService = async (data: any): Promise<ServiceWorkflow> => {
  // No necesitamos forzar el estado aquí ya que lo maneja el backend
  console.log('Enviando datos del servicio:', data); // Debug
  
  const response = await api.post('services/client/create-service/', data);
  return response.data;
};

// API para obtener servicios de un cliente específico
export const getClientServices = async (clientId: number): Promise<ServiceWorkflow[]> => {
  const response = await api.get(`services/client/${clientId}/services/`);
  return response.data;
};
