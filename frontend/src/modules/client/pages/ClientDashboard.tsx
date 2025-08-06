import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const ClientDashboard = () => {
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
                            Gestiona tus servicios de recolección de residuos
                        </p>
                    </div>
                    <div className="text-sm text-green-600 bg-green-100 px-4 py-2 rounded-full">
                        🌱 Cliente EcoTrash
                    </div>
                </div>

                {/* Cards de estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Servicios Solicitados</p>
                                <p className="text-2xl font-bold text-blue-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">📋</span>
                        </div>
                        <p className="text-sm mt-4 text-blue-700">Servicios totales</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Servicios Completados</p>
                                <p className="text-2xl font-bold text-green-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">✅</span>
                        </div>
                        <p className="text-sm mt-4 text-green-700">Servicios finalizados</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Residuos Gestionados</p>
                                <p className="text-2xl font-bold text-purple-700 mt-2">-</p>
                            </div>
                            <span className="text-3xl">♻️</span>
                        </div>
                        <p className="text-sm mt-4 text-purple-700">Kg de residuos</p>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Acciones rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/client/services"
                            className="border border-green-200 rounded-lg p-4 text-center hover:bg-green-50 transition-colors"
                        >
                            <div className="text-2xl mb-2">🚛</div>
                            <p className="text-sm font-medium text-green-700">Solicitar Servicio</p>
                            <p className="text-xs text-gray-500 mt-1">Programar recolección</p>
                        </Link>
                        
                        <Link
                            to="/client/services"
                            className="border border-blue-200 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors"
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <p className="text-sm font-medium text-blue-700">Mis Servicios</p>
                            <p className="text-xs text-gray-500 mt-1">Ver historial</p>
                        </Link>

                        <Link
                            to="/client/certificate"
                            className="border border-purple-200 rounded-lg p-4 text-center hover:bg-purple-50 transition-colors"
                        >
                            <div className="text-2xl mb-2">📄</div>
                            <p className="text-sm font-medium text-purple-700">Certificados</p>
                            <p className="text-xs text-gray-500 mt-1">Descargar certificados</p>
                        </Link>
                    </div>
                </div>

                {/* Información de contacto */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Información de Contacto</h2>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <span className="text-green-600 mr-3">📧</span>
                            <span className="text-gray-700">Soporte: soporte@ecotrash.com</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-600 mr-3">📞</span>
                            <span className="text-gray-700">Teléfono: (555) 123-4567</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-green-600 mr-3">🕒</span>
                            <span className="text-gray-700">Horario: Lunes a Viernes 8:00 AM - 6:00 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
