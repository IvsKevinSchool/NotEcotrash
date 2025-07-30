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

export interface Client {
    pk_client: number;
    name: string;
    legal_name: string;
    rfc: string;
    email: string;
    phone_number?: string;
    phone_number_2?: string;
    is_active: boolean;
}

export interface ClientLocation {
    pk_client_location: number;
    fk_client: number;
    fk_location: LocationAPI;
    is_main: boolean;
    client_name?: string; // Para mostrar el nombre del cliente en la tabla
}

export interface ClientLocationsResponse {
    management_id: number;
    locations: ClientLocation[];
}

export type LocationActionHandler = (id: string) => void;

// Interfaz para el formulario de ubicaciones que coincide con el modelo del backend
export interface LocationFormData {
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

export interface Client {
    pk_client: number;
    name: string;
    legal_name: string;
    rfc: string;
    email: string;
    phone_number?: string;
    phone_number_2?: string;
    is_active: boolean;
}

export interface ClientLocation {
    pk_client_location: number;
    fk_client: number;
    fk_location: LocationAPI;
    is_main: boolean;
    client_name?: string; // Para mostrar el nombre del cliente en la tabla
}

export interface ClientLocationsResponse {
    management_id: number;
    locations: ClientLocation[];
}