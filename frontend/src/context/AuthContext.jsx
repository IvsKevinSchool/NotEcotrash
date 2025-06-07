import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial

  useEffect(() => {
    const storedUser = localStorage.getItem('ecotrash_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('ecotrash_user');
      }
    }
    setLoading(false); // Finaliza la carga
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ecotrash_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecotrash_user');
  };

  const isAuthenticated = () => {
    return !!user; // o tu lógica para verificar autenticación (ej: verificar token)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};