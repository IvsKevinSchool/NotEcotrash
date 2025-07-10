import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const SidebarECO = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();


    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const baseBtnStyle = 'flex items-center px-4 py-3 rounded-lg transition-colors duration-200';
    const activeBtnStyle = 'bg-green-600 font-semibold text-white shadow-md'
    const inactiveBtnStyle = 'text-green-100 hover:bg-green-700 hover:text-white';

    const getStyle = (path: string) =>
        pathname === path ? `${baseBtnStyle} ${activeBtnStyle}` : `${baseBtnStyle} ${inactiveBtnStyle}`;


    const navLinks = [
        { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        // { to: '/reportes', label: 'Reports', icon: '📈' },
        { to: '/admin/clients', label: 'Clients', icon: '👥' },
        { to: '/admin/services', label: 'Services', icon: '♻️' },
        { to: '/admin/typeServices', label: 'Type Services', icon: '📈' },
        { to: '/admin/wastes', label: 'Wastes', icon: '🗑️' },
        { to: '/admin/locations', label: 'Locations', icon: '🚩' }, // De momento esta en admin
        { to: '/admin/management', label: 'Management', icon: '💼' },
        { to: '/admin/collector', label: 'Collector', icon: '🚛' },
        { to: '/admin/certificate', label: 'Certificate', icon: '📑' },
        // { to: '/configuracion', label: 'Configuration', icon: '⚙️' },
    ]


    return (
        <div className="w-64 h-screen bg-green-800 text-white fixed left-0 top-0 py-5 flex flex-col">
            {/* Logo */}
            <div className="text-center py-5 mb-8 border-b border-green-700 flex flex-col items-center">
                <img
                    src="/logo.png"
                    alt="Logo EcoTrash"
                    className="h-12 w-auto mb-2"
                />
                <h1 className="text-2xl font-bold text-green-100">EcoTrash</h1>
                <p className="text-xs text-green-300 mt-1">Gestión de residuos</p>
            </div>

            {/* Menú */}
            <nav className="flex-1 space-y-1 px-2">
                {navLinks.map(link => {
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={getStyle(link.to)}
                        >
                            <span className="mr-3">{link.icon}</span>
                            {link.label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Botón de cerrar sesión */}
            <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-red-200 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200 mx-2 mb-3"
            >
                <span className="ml-3">🚪Cerrar sesión</span>
            </button>
            {/* <NavLink
                onClick={handleLogout}
                className="flex items-center px-4 py-3 text-red-200 hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200 mx-2 mb-3"
            >
                <span className="mr-3">🚪</span>
                Cerrar sesión
            </NavLink> */}

            {/* Footer del sidebar */}
            <div className="p-4 border-t border-green-700 mt-auto">
                <div className="flex items-center justify-between text-green-300 text-sm">
                    <span>Versión 1.0.0</span>
                    <span>🌱</span>
                </div>
                <div className="mt-2 text-xs text-green-400">
                    Sesión activa: usuario@ecotrash.com
                </div>
            </div>
        </div>
    );
};