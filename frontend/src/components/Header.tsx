import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload(); // Forzar recarga completa
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Panel de Control
          </h1>
          <p className="text-sm text-gray-600">
            Bienvenido, {user?.name || user?.username}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <NotificationBell />
          
          {/* Información del usuario */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.name || user?.username}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {user?.role}
              </p>
            </div>
            
            {/* Avatar */}
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(user?.name || user?.username)?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Botón de logout */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors p-1"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
