// List Location
export interface Location {
    id: string;
    companyName: string;
    address: string;
    contactPerson: string;
    phone: string;
    email: string;
    wasteType: string;
    collectionFrequency: string;
    lastCollection: string;
    nextCollection: string;
    coordinates: string;
    notes: string;
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