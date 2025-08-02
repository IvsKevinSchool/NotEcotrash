import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación automáticamente
api.interceptors.request.use(
    (config) => {
        const userString = localStorage.getItem('ecotrash_user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error('Error parsing user token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error (opcional)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expirado o inválido, limpiar localStorage
            console.log('🔍 Token expirado o inválido, limpiando localStorage');
            localStorage.removeItem('ecotrash_user');
            // Solo redirigir si no estamos ya en login o rutas públicas
            if (!window.location.pathname.includes('/login') && 
                !window.location.pathname.includes('/register') &&
                window.location.pathname !== '/') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;