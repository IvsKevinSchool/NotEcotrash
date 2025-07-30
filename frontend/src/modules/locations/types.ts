export interface Location {
    pk_location: string;
    name: string;
    postcode: string;
    interior_number?: string;
    exterior_number: string;
    street_name: string;
    neighborhood?: string;
    country: string;
    city: string;
    state: string;
    phone_number?: string;
    created_at: string;
    is_active: boolean;
}

export type LocationActionHandler = (id: string) => void;

// Add Location
export interface LocationFormData {
    companyName: string;
    address: string;
    contactPerson: string;
    phone: string;
    email: string;
    wasteType: string;
    collectionFrequency: string;
    nextCollection: string;
    coordinates: string;
    notes: string;
}

export type HandleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;

export interface ManagementLocationsResponse {
    management_id: number;
    locations: ManagementLocation[];
}

export interface ManagementLocation {
    fk_manageement: number;
    fk_location: LocationAPI;
    is_main: boolean;
    pk_management_locations: number;
    created_at?: string;  // Opcional si está en el modelo pero no en el JSON
    updated_at?: string;  // Opcional si está en el modelo pero no en el JSON
    is_active?: boolean;  // Opcional si está en el modelo pero no en el JSON
}

export interface LocationAPI {
    pk_location: number;
    name: string;
    postcode: string;
    interior_number: string | null;
    exterior_number: number;
    street_name: string;
    neighborhood: string;
    country: string;
    state: string;
    city: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}