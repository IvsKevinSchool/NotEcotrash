import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token de autenticación si existe
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('ecotrash_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${user.token}`;
            }
        } catch (e) {
            // Si hay error, no se agrega el token
        }
    }
    return config;
});

export default api;