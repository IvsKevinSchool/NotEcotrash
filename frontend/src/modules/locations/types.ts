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