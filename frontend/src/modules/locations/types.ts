export interface Location {
    pk_location: string;
    name: string;
    postal_code: string;
    interior_number?: string;
    exterior_number: string;
    street_name: string;
    neighborhood?: string;
    country: string;
    city: string;
    state: string;
    email?: string;
    phone_number?: string;
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