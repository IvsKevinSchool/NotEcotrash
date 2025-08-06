import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const CollectorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-green-800">
                            Bienvenido, {user?.username}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Panel de control para recolector
                        </p>
                    </div>
                    <div className="text-sm text-green-600 bg-green-100 px-4 py-2 rounded-full">
                        🚛 Recolector EcoTrash
                    </div>
                </div>

                {/* Cards de estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Servicios de Hoy</p>
                                <p className="text-2xl font-bold text-blue-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">📋</span>
                        </div>
                        <p className="text-sm mt-4 text-blue-700">Programados para hoy</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">En Progreso</p>
                                <p className="text-2xl font-bold text-orange-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">🚛</span>
                        </div>
                        <p className="text-sm mt-4 text-orange-700">Servicios activos</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Completados</p>
                                <p className="text-2xl font-bold text-green-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">✅</span>
                        </div>
                        <p className="text-sm mt-4 text-green-700">Servicios finalizados</p>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Acciones rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/collector/services"
                            className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <p className="text-sm font-medium text-green-700">Mis Servicios</p>
                            <p className="text-xs text-gray-500 mt-1">Ver servicios asignados</p>
                        </Link>
                        
                        <Link
                            to="/collector/services"
                            className="border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors"
                        >
                            <div className="text-2xl mb-2">🚛</div>
                            <p className="text-sm font-medium text-blue-700">Servicios de Hoy</p>
                            <p className="text-xs text-gray-500 mt-1">Programados para hoy</p>
                        </Link>
                    </div>
                </div>

                {/* Información útil */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Información Importante</h2>
                    <div className="space-y-4">
                        <div className="flex items-start pb-4 border-b border-gray-100">
                            <div className="bg-blue-100 text-blue-800 p-2 rounded-full mr-4">
                                📋
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-medium">Horario de trabajo:</span> Lunes a Viernes 7:00 AM - 5:00 PM
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Sábados disponible previa programación</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start pb-4 border-b border-gray-100">
                            <div className="bg-green-100 text-green-800 p-2 rounded-full mr-4">
                                📞
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-medium">Contacto de emergencia:</span> (555) 987-6543
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Disponible 24/7 para emergencias</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-orange-100 text-orange-800 p-2 rounded-full mr-4">
                                ⚠️
                            </div>
                            <div>
                                <p className="text-sm">
                                    <span className="font-medium">Recordatorio:</span> Marcar servicios como completados al finalizar
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Esto actualiza el estado para el cliente y gestión</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
