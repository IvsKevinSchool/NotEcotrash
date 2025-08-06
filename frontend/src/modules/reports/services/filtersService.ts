import api from '../../../api';

// Interfaces para los datos de filtros
export interface Service {
  pk_services: number;
  service_number: string;
  fk_clients?: {
    pk_client: number;
    name: string;
    legal_name: string;
  };
}

export interface Client {
  pk_client: number;
  name: string;
  legal_name: string;
}

export interface Status {
  pk_status: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  get_full_name: string;
}

// Servicios para obtener datos de filtros
export const getServices = async (management_id: number): Promise<Service[]> => {
  const response = await api.get(`services/services/?management_id=${management_id}`);
  return response.data;
};

export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('client/client/');
  return response.data;
};

export const getStatuses = async (): Promise<Status[]> => {
  const response = await api.get('services/status/');
  return response.data;
};

export const getCollectors = async (): Promise<User[]> => {
  const response = await api.get('accounts/auth/users/?role=collector');
  return response.data;
};
