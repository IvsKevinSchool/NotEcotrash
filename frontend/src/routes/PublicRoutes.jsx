import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated()) {
    // Redirigir al dashboard si ya está autenticado
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute;