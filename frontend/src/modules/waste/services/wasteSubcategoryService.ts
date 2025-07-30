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

// Servicios para subcategorías de residuos
export const getWasteSubcategories = async (): Promise<WasteSubcategory[]> => {
  const response = await api.get('waste/subcategory/');
  return response.data;
};

export const getWasteSubcategory = async (id: number): Promise<WasteSubcategory> => {
  const response = await api.get(`waste/subcategory/${id}/`);
  return response.data;
};

export const createWasteSubcategory = async (data: WasteSubcategoryFormData): Promise<WasteSubcategory> => {
  const response = await api.post('waste/subcategory/', data);
  return response.data;
};

export const updateWasteSubcategory = async (id: number, data: WasteSubcategoryFormData): Promise<WasteSubcategory> => {
  const response = await api.put(`waste/subcategory/${id}/`, data);
  return response.data;
};

export const deleteWasteSubcategory = async (id: number): Promise<void> => {
  await api.delete(`waste/subcategory/${id}/`);
};

// Servicio para obtener residuos (para el dropdown)
export const getWastes = async (): Promise<Waste[]> => {
  const response = await api.get('waste/waste/');
  return response.data;
};
