import { ReactNode } from "react";

export interface LoadingWrapperProps {
    isLoading: boolean;
    error: boolean | Error | string | null;
    children: ReactNode;
    loadingComponent?: ReactNode;
    errorComponent?: ReactNode;
}

export type LoadingProps = {
    size?: 'small' | 'medium' | 'large';
    fullScreen?: boolean;
    className?: string;
}

export interface IUserData {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
    token: string;
    id_admin: number;
    // Información específica por rol
    management?: {
        pk_management: number;
        name: string;
        email: string;
        phone_number: string;
        phone_number_2: string;
        rfc: string;
    };
    client?: {
        pk_client: number;
        name: string;
        legal_name: string;
        email: string;
        phone_number: string;
        phone_number_2: string;
        rfc: string;
    };
    collector?: {
        pk_collector_user: number;
        name: string;
        last_name: string;
        phone_number: string;
        fk_management: number;
    };
}

export interface IAuthContext {
    user: IUserData;
    login: (userData: IUserData) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export interface IUserJSONPlaceHolder {
    id: number,
    name: string,
    email: string,
    company: {
        name: string
    },
    website: string
}