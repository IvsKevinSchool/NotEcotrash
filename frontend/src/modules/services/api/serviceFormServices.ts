import api from '../../../api';

// Interfaces para los datos del formulario de servicios
export interface Client {
  pk_client: number;
  name: string;
  legal_name: string;
}

export interface Location {
  pk_location: number;
  name: string;
  city: string;
  state?: string; // Opcional ya que no todos los datos lo tienen
}

export interface Status {
  pk_status: number;
  name: string;
  description?: string;
}

export interface TypeService {
  pk_type_services: number;
  name: string;
  description?: string;
}

export interface Waste {
  pk_waste: number;
  name: string;
  description?: string;
}

export interface WasteSubcategory {
  pk_waste_subcategory: number;
  name?: string; // Campo opcional agregado para compatibilidad
  description: string;
  fk_waste: number | {
    pk_waste: number;
    name: string;
    description?: string;
  };
}

// Servicios para obtener datos para el formulario de servicios
export const getClientsForForm = async (): Promise<Client[]> => {
  const response = await api.get('client/client/');
  return response.data;
};

export const getLocationsForForm = async (): Promise<Location[]> => {
  const response = await api.get('core/locations/');
  return response.data;
};

export const getStatusesForForm = async (): Promise<Status[]> => {
  const response = await api.get('services/status/');
  return response.data;
};

export const getTypeServicesForForm = async (): Promise<TypeService[]> => {
  const response = await api.get('services/typeServices/');
  return response.data;
};

export const getWastesForForm = async (): Promise<Waste[]> => {
  const response = await api.get('waste/waste/');
  return response.data;
};

export const getWasteSubcategoriesForForm = async (): Promise<WasteSubcategory[]> => {
  const response = await api.get('waste/subcategory/');
  return response.data;
};

// Función para obtener todos los datos necesarios para el formulario
export const getServiceFormData = async () => {
  try {
    const [clients, locations, statuses, typeServices, wastes, wasteSubcategories] = await Promise.all([
      getClientsForForm(),
      getLocationsForForm(),
      getStatusesForForm(),
      getTypeServicesForForm(),
      getWastesForForm(),
      getWasteSubcategoriesForForm()
    ]);

    return {
      clients,
      locations,
      statuses,
      typeServices,
      wastes,
      wasteSubcategories
    };
  } catch (error) {
    console.error('Error fetching service form data:', error);
    throw error;
  }
};
