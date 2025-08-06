import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Logo.png';

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


    // Menús por rol
    interface INavLink {
        to: string;
        label: string;
        icon: string;
    }

    const adminLinks = [
        { to: '/admin/dashboard', label: 'Tablero', icon: '📊' },
        { to: '/admin/clients', label: 'Empresas de Gestión', icon: '🏢' },
    ];

    const managementLinks = [
        { to: '/management/', label: 'Panel Principal', icon: '📊' },
        { to: '/management/reports', label: 'Reportes', icon: '📃' },
        { to: '/management/clients', label: 'Clientes', icon: '👥' },
        { to: '/management/services', label: 'Gestión de Servicios', icon: '♻️' },
        { to: '/management/type-services', label: 'Tipo de Servicios', icon: '📚' },
        { to: '/management/locations', label: 'Locaciones', icon: '🚩' },
        { to: '/management/collector', label: 'Recolectores', icon: '🚛' },
        { to: '/waste', label: 'Residuos', icon: '🗑️' },
        { to: '/management/certificate', label: 'Certificados', icon: '📜' },
        { to: '/management/backups', label: 'Repaldos', icon: '💩' },
    ];

    const clientLinks = [
        { to: '/client/dashboard', label: 'Tablero', icon: '📊' },
        { to: '/client/services', label: 'Solicitar Servicios', icon: '♻️' },
        { to: '/client/certificate', label: 'Certificados', icon: '📑' },
        { to: '/client/profile', label: 'Perfil', icon: '👥' },
    ];

    const collectorLinks = [
        { to: '/collector/dashboard', label: 'Tablero', icon: '📊' },
        { to: '/collector/services', label: 'Mis Servicios', icon: '🚛' },
    ];

    // Selección de menú según rol
    let navLinks = [] as INavLink[];
    switch (user?.role) {
        case 'admin':
            navLinks = adminLinks;
            break;
        case 'management':
            navLinks = managementLinks;
            break;
        case 'client':
            navLinks = clientLinks;
            break;
        case 'collector':
            navLinks = collectorLinks;
            break;
        default:
            navLinks = [];
    }


    return (
        <div className="w-48 min-h-screen bg-green-800 text-white flex flex-col">
            {/* Logo */}
            <div className="text-center py-5 mb-2 border-b border-green-700 flex flex-col items-center">
                <img
                    src={logo}
                    alt="Logo EcoTrash"
                    className="h-12 w-auto mb-2"
                />
                <h1 className="text-2xl font-bold text-green-100">Zerura</h1>
                <p className="text-xs text-green-300 mt-1">Gestión de residuos</p>
            </div>

            {/* Menú */}
            <nav className="flex-1 space-y-1 px-2">
                {navLinks.map(link => {
                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={getStyle(link.to) + ' text-sm'}
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
                className="flex px-4 py-3 text-white hover:text-white hover:bg-red-600 rounded-lg transition-colors duration-200 mx-2 mb-3"
            >
                <span className="text-sm ml-1">🚪   Cerrar Sesión</span>
            </button>

            {/* Footer del sidebar */}
            <div className="p-4 border-t border-green-700 mt-auto">
                <div className="flex items-center justify-between text-green-300 text-sm">
                    <span>Versión 1.0.0</span>
                    <span>🌱</span>
                </div>
                <div className="mt-2 text-xs text-green-300">
                    Sesión activa: {user?.name || 'Invitado'}
                </div>
            </div>
        </div>
    );
};