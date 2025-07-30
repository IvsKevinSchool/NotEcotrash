import api from '../../../api';

export interface ServiceLog {
  pk_service_log: number;
  completed_date: string;
  waste_amount: string;
  document?: string;
  notes?: string;
  fk_user?: {
    id: number;
    username: string;
    full_name: string;
    role: string;
  };
  fk_services?: {
    pk_services: number;
    service_number: string;
    scheduled_date: string;
    fk_clients?: {
      pk_client: number;
      name: string;
      legal_name: string;
    };
    fk_locations?: {
      pk_location: number;
      name: string;
      city: string;
    };
    fk_status?: {
      pk_status: number;
      name: string;
    };
  };
}

export interface ServiceLogFormPayload {
  // Removemos completed_date ya que se establece automáticamente en el backend
  waste_amount: string;
  document?: File;
  notes?: string;
  fk_user: number; // Ahora es requerido
  fk_services: number;
}

export const getServiceLogs = async (filters?: { 
  service_id?: number; 
  user_id?: number; 
  client_id?: number; 
  status_id?: number; 
  selected_date?: string; // Cambio: solo una fecha
}): Promise<ServiceLog[]> => {
  const params = new URLSearchParams();
  if (filters?.service_id) params.append('service_id', filters.service_id.toString());
  if (filters?.user_id) params.append('user_id', filters.user_id.toString());
  if (filters?.client_id) params.append('client_id', filters.client_id.toString());
  if (filters?.status_id) params.append('status_id', filters.status_id.toString());
  if (filters?.selected_date) params.append('selected_date', filters.selected_date);
  
  const response = await api.get(`services/service-logs/?${params.toString()}`);
  return response.data;
};

export const getServiceLog = async (id: number): Promise<ServiceLog> => {
  const response = await api.get(`services/service-logs/${id}/`);
  return response.data;
};

export const createServiceLog = async (data: ServiceLogFormPayload): Promise<ServiceLog> => {
  const response = await api.post('services/service-logs/', data);
  return response.data;
};

export const updateServiceLog = async (id: number, data: ServiceLogFormPayload): Promise<ServiceLog> => {
  const response = await api.put(`services/service-logs/${id}/`, data);
  return response.data;
};

export const deleteServiceLog = async (id: number): Promise<void> => {
  await api.delete(`services/service-logs/${id}/`);
};
