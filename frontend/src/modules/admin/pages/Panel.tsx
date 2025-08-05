import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const Panel = () => {

    const { user } = useAuth()
    console.log(user)

    return (
        <div className="p-6">
            <h1>{user?.name} : {user?.id}</h1>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-800">Panel de Administración</h1>
                <div className="text-sm text-green-600 bg-green-100 px-4 py-2 rounded-full">
                    🌱 Modo ecológico activado
                </div>
            </div>

            {/* Cards de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    {
                        title: "Usuarios registrados",
                        value: "1,248",
                        change: "+12%",
                        icon: "👥",
                        bg: "bg-green-50",
                        text: "text-green-700"
                    },
                    {
                        title: "Residuos gestionados",
                        value: "5,742 kg",
                        change: "↓3%",
                        icon: "♻️",
                        bg: "bg-teal-50",
                        text: "text-teal-700"
                    },
                    {
                        title: "Puntos de reciclaje",
                        value: "24",
                        change: "+2 nuevos",
                        icon: "📍",
                        bg: "bg-emerald-50",
                        text: "text-emerald-700"
                    }
                ].map((item, index) => (
                    <div key={index} className={`${item.bg} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{item.title}</p>
                                <p className={`text-2xl font-bold ${item.text} mt-2`}>{item.value}</p>
                            </div>
                            <span className="text-3xl">{item.icon}</span>
                        </div>
                        <p className={`text-sm mt-4 ${item.text}`}>{item.change}</p>
                    </div>
                ))}
            </div>

            {/* Sección de acciones rápidas */}
            {/* <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Acciones rápidas</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/admin/users"
                        className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">👥</div>
                        <p className="text-sm font-medium text-green-700">Gestionar usuarios</p>
                    </Link>
                    <Link
                        to="/admin/waste"
                        className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">♻️</div>
                        <p className="text-sm font-medium text-green-700">Registrar residuos</p>
                    </Link>
                    <Link
                        to="/admin/reports"
                        className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-sm font-medium text-green-700">Generar reportes</p>
                    </Link>
                    <Link
                        to="/admin/settings"
                        className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                    >
                        <div className="text-2xl mb-2">⚙️</div>
                        <p className="text-sm font-medium text-green-700">Configuración</p>
                    </Link>
                </div>
            </div> */}
        
            {/* Actividad reciente */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-green-700 mb-4">Actividad reciente</h2>
                <div className="space-y-4">
                    {[
                        { user: "María García", action: "registró 15kg de plástico", time: "Hace 2 horas" },
                        { user: "EcoRecicla S.A.", action: "actualizó su punto de reciclaje", time: "Hace 5 horas" },
                        { user: "Admin", action: "agregó nuevo usuario", time: "Ayer" }
                    ].map((item, index) => (
                        <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                            <div className="bg-green-100 text-green-800 p-2 rounded-full mr-4">
                                {index === 0 ? "🌿" : index === 1 ? "🏭" : "👨‍💼"}
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-medium">{item.user}</span> {item.action}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link
                    to="/admin/activity"
                    className="inline-block mt-4 text-sm text-green-600 hover:text-green-800 font-medium"
                >
                    Ver toda la actividad →
                </Link>
            </div>
        </div>
    );
};