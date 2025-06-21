import { ReactNode } from 'react';
import { Loading } from './Loading';
import { LoadingWrapperProps } from '../interfaces';

export const LoadingWrapper = ({
    isLoading,
    error,
    children,
    loadingComponent = <Loading />,
    errorComponent = (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
                <div className="flex-shrink-0">
                    <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-700">
                        Error al cargar los datos. Por favor intenta nuevamente.
                    </p>
                </div>
            </div>
        </div>
    ),
}: LoadingWrapperProps) => {
    if (isLoading) return loadingComponent;
    if (error) return errorComponent;
    return children;
};