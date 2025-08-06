import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IAuthContext, IUserData } from '../interfaces';

const initialUser: IUserData = {
    id: 0,
    username: '',
    name: '',
    email: '',
    role: '',
    token: '',
    id_admin: 0,
};

const AuthContext = createContext<IAuthContext>({
    user: initialUser,
    login: () => { },
    logout: () => { },
    isAuthenticated: false,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUserData>(initialUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('ecotrash_user');
        if (storedUser) {
            try {
                const parsedUser: IUserData = JSON.parse(storedUser);
                // Validación básica de la estructura del usuario
                if (parsedUser.id) {
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('ecotrash_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: IUserData) => {
        console.log('🔍 AuthContext - Login llamado con:', userData);
        setUser(userData);
        localStorage.setItem('ecotrash_user', JSON.stringify(userData));
        console.log('🔍 AuthContext - Usuario guardado en localStorage');
    };

    const logout = () => {
        console.log('🔍 AuthContext - Logout llamado');
        setUser(initialUser);
        localStorage.removeItem('ecotrash_user');
    };

    const isAuthenticated = !!user.token && user.id !== 0; // Verificar token y id válido

    console.log('🔍 AuthContext - Estado actual:', {
        user,
        isAuthenticated,
        loading,
        hasToken: !!user.token,
        hasValidId: user.id !== 0
    });

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};