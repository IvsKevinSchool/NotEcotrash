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