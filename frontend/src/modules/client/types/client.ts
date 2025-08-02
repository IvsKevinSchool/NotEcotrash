export interface Client {
    pk_client: string;
    fk_management: number;
    name: string;
    legal_name: string;
    rfc: string;
    email: string;
    phone_number?: string | null;
    phone_number_2?: string | null;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
}

export interface ClientListProps {
    title?: string;
    className?: string;
}