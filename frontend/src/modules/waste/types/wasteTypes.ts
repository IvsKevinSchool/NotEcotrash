export interface Waste {
    pk_waste: string;
    name: string;
    description: string;
    is_active?: boolean;
}

export interface WasteSubcategory {
    pk_waste_subcategory?: string;
    name: string;
    description: string;
    is_active: boolean;
    fk_waste: string;
}

export type WasteFormData = Omit<Waste, 'pk_waste'>;
export type WasteSubcategoryFormData = Omit<WasteSubcategory, 'pk_waste_subcategory'>;