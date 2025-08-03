import api from '../../../api';

// Interfaces
export interface WasteSubcategory {
  pk_waste_subcategory: number;
  description: string;
  is_active: boolean;
  fk_waste: number | {
    pk_waste: number;
    name: string;
    description?: string;
  };
  name?: string; // Campo opcional por si el backend lo agrega después
}

export interface Waste {
  pk_waste: number;
  name: string;
  description?: string;
}

export interface WasteSubcategoryFormData {
  name?: string; // Opcional, por si el backend no lo maneja aún
  description: string;
  fk_waste: number;
  is_active?: boolean;
}

// Servicios para subcategorías de residuos (endpoints filtrados por gestión)
export const getWasteSubcategories = async (managementId?: number): Promise<WasteSubcategory[]> => {
  // Si se proporciona managementId, usar endpoint filtrado, sino usar el general
  let url = 'waste/subcategory/';
  
  if (managementId) {
    url = `management/management/${managementId}/waste-subcategories/`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const getWasteSubcategory = async (id: number): Promise<WasteSubcategory> => {
  const response = await api.get(`waste/subcategory/${id}/`);
  return response.data;
};

export const createWasteSubcategory = async (data: WasteSubcategoryFormData, managementId?: number): Promise<WasteSubcategory> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = 'waste/subcategory/';
  
  if (managementId) {
    url = `management/management/${managementId}/create-waste-subcategory/`;
  }
  
  const response = await api.post(url, data);
  return response.data;
};

export const updateWasteSubcategory = async (id: number, data: WasteSubcategoryFormData, managementId?: number): Promise<WasteSubcategory> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = `waste/subcategory/${id}/`;
  
  if (managementId) {
    url = `management/management/${managementId}/update-waste-subcategory/${id}/`;
  }
  
  const response = await api.put(url, data);
  return response.data;
};

export const deleteWasteSubcategory = async (id: number, managementId?: number): Promise<void> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = `waste/subcategory/${id}/`;
  
  if (managementId) {
    url = `management/management/${managementId}/delete-waste-subcategory/${id}/`;
  }
  
  await api.delete(url);
};

// Servicios para residuos (endpoints filtrados por gestión)
export const getWastes = async (managementId?: number): Promise<Waste[]> => {
  // Si se proporciona managementId, usar endpoint filtrado, sino usar el general
  let url = 'waste/waste/';
  
  if (managementId) {
    url = `management/management/${managementId}/wastes/`;
  }
  
  const response = await api.get(url);
  return response.data;
};

export const createWaste = async (data: { name: string; description?: string; is_active?: boolean }, managementId?: number): Promise<Waste> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = 'waste/waste/';
  
  if (managementId) {
    url = `management/management/${managementId}/create-waste/`;
  }
  
  const response = await api.post(url, data);
  return response.data;
};

export const updateWaste = async (id: number, data: { name: string; description?: string; is_active?: boolean }, managementId?: number): Promise<Waste> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = `waste/waste/${id}/`;
  
  if (managementId) {
    url = `management/management/${managementId}/update-waste/${id}/`;
  }
  
  const response = await api.put(url, data);
  return response.data;
};

export const deleteWaste = async (id: number, managementId?: number): Promise<void> => {
  // Si se proporciona managementId, usar endpoint de gestión, sino usar el general
  let url = `waste/waste/${id}/`;
  
  if (managementId) {
    url = `management/management/${managementId}/delete-waste/${id}/`;
  }
  
  await api.delete(url);
};
