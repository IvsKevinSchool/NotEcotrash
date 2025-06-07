import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Common/Loading';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    console.log(isAuthenticated)

    if (loading) {
        return <Loading fullScreen />;
    }

    if (!isAuthenticated()) {
        // Redirigir al login, guardando la ubicación actual para volver después del login
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return <Outlet />
};

export default PrivateRoute;