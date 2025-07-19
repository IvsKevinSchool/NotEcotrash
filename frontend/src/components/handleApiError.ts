import { toast } from 'react-toastify';

interface ApiError {
    message: string;
    response?: {
        data?: {
            [key: string]: string | string[];
        };
        status?: number;
    };
}

export function handleApiError(error: unknown, defaultMessage = 'Ocurrió un error') {
    const axiosError = error as ApiError;

    // Error de validación de Django (400)
    if (axiosError.response?.status === 400 && axiosError.response.data) {
        const errorData = axiosError.response.data;

        Object.entries(errorData).forEach(([field, errors]) => {
            const errorList = Array.isArray(errors) ? errors : [errors];
            errorList.forEach((errorMsg) => {
                toast.error(`${field}: ${errorMsg}`);
            });
        });
        return;
    }

    // Otros errores HTTP
    if (axiosError.response) {
        toast.error(axiosError.message);
        return;
    }

    // Error genérico (network, etc)
    toast.error(defaultMessage);
}