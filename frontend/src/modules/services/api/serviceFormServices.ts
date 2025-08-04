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
  client_ids?: number[]; // IDs de clientes asociados a esta ubicación
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

// Nueva función para obtener ubicaciones con información de clientes para servicios
export const getLocationsForServices = async (managementId: number): Promise<Location[]> => {
  try {
    console.log('Obteniendo ubicaciones para management:', managementId);
    const response = await api.get(`client/management/${managementId}/all-locations/`);
    console.log('Respuesta de ubicaciones:', response.data);
    
    // Transformar los datos de ClientsLocations a Location con client_ids
    const clientLocations = response.data.locations;
    
    if (!clientLocations || clientLocations.length === 0) {
      console.log('No se encontraron ubicaciones en la respuesta');
      return getLocationsForForm();
    }
    
    const locationMap = new Map<number, Location>();
    
    clientLocations.forEach((clientLocation: any) => {
      const location = clientLocation.fk_location;
      const locationId = location.pk_location;
      
      if (locationMap.has(locationId)) {
        // Si la ubicación ya existe, agregar el cliente a client_ids
        const existingLocation = locationMap.get(locationId)!;
        if (!existingLocation.client_ids!.includes(clientLocation.fk_client)) {
          existingLocation.client_ids!.push(clientLocation.fk_client);
        }
      } else {
        // Nueva ubicación
        locationMap.set(locationId, {
          pk_location: location.pk_location,
          name: location.name,
          city: location.city,
          state: location.state,
          client_ids: [clientLocation.fk_client]
        });
      }
    });
    
    const locations = Array.from(locationMap.values());
    console.log('Ubicaciones procesadas:', locations);
    return locations;
  } catch (error) {
    console.error('Error fetching locations for services:', error);
    console.log('Usando fallback para obtener ubicaciones');
    // Fallback al endpoint original sin client_ids
    return getLocationsForForm();
  }
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
export const getServiceFormData = async (managementId?: number) => {
  try {
    console.log('Obteniendo datos del formulario para management:', managementId);
    
    const [clients, statuses, typeServices, wastes, wasteSubcategories] = await Promise.all([
      getClientsForForm(),
      getStatusesForForm(),
      getTypeServicesForForm(),
      getWastesForForm(),
      getWasteSubcategoriesForForm()
    ]);

    // Obtener ubicaciones con manejo de errores mejorado
    let locations: Location[] = [];
    try {
      if (managementId) {
        locations = await getLocationsForServices(managementId);
      }
      // Si no hay managementId o no se obtuvieron ubicaciones, usar endpoint general
      if (locations.length === 0) {
        console.log('Usando endpoint general de ubicaciones');
        locations = await getLocationsForForm();
      }
    } catch (error) {
      console.error('Error obteniendo ubicaciones, usando endpoint general:', error);
      locations = await getLocationsForForm();
    }

    console.log('Datos del formulario obtenidos:', {
      clients: clients.length,
      locations: locations.length,
      statuses: statuses.length,
      typeServices: typeServices.length,
      wastes: wastes.length,
      wasteSubcategories: wasteSubcategories.length
    });

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
