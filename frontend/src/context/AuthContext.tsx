import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type IUserData = {
    id: string;
    name: string;
    email: string;
};

const initialUser: IUserData = {
    id: '',
    name: '',
    email: '',
};

type IAuthContext = {
    user: IUserData;
    login: (userData: IUserData) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
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
        setUser(userData);
        localStorage.setItem('ecotrash_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(initialUser);
        localStorage.removeItem('ecotrash_user');
    };

    const isAuthenticated = !!user; // Cambiado a propiedad computada

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