import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    console.log('🔍 ProtectedRoute - Estado de autenticación:', {
        user,
        loading,
        isAuthenticated,
        currentPath: location.pathname
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user.token) {
        console.log('🔍 ProtectedRoute - Usuario no autenticado, redirigiendo a login');
        // Guardar la ubicación actual para redirigir después del login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('🔍 ProtectedRoute - Usuario autenticado, renderizando children');
    return <>{children}</>;
};

export default ProtectedRoute;
