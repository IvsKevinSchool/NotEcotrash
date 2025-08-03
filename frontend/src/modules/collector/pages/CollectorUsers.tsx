import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CollectorUserFormData, collectorUserSchema, ICollector } from "../schemas/collectorUserSchema";
import {
    getCollectorUsers,
    getCollectorUser,
    createCollectorUser,
    updateCollectorUser,
    deleteCollectorUser,
} from "../services/collectorUserService";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CollectorUsers = () => {
    const [collectorUsers, setCollectorUsers] = useState<ICollector[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<CollectorUserFormData>({
        resolver: zodResolver(collectorUserSchema),
    });

    // Watch password fields to compare them
    const password = watch("fk_user.password", "");
    const password2 = watch("fk_user.password2", "");

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Pasar el ID del management autenticado para obtener solo sus collectors
            const data = await getCollectorUsers(user?.id);
            setCollectorUsers(data);
        } catch (error) {
            toast.error("Error fetching collector users");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: CollectorUserFormData) => {
        try {
            if (isEditing && currentId) {
                await updateCollectorUser(currentId, data);
                toast.success("Collector user updated successfully");
            } else {
                // Incluir el management_id del usuario autenticado en la URL
                await createCollectorUser(data, user.id);
                toast.success("Collector user created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving collector user:", error);
            toast.error("Error saving collector user");
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/management/collector/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("¿Estás seguro que deseas eliminar este recolector? Esta acción no se puede deshacer.")) {
            try {
                await deleteCollectorUser(id);
                toast.success("Collector user deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Error deleting collector user");
            }
        }
    };

    const resetForm = () => {
        reset({
            name: "",
            last_name: "",
            phone_number: "",
            fk_user: {
                username: "",
                email: "",
                first_name: "",
                last_name: "",
                password: "",
                password2: ""
            }
        });
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="mx-auto">

                {/* Tabla de Collectors - Ahora está arriba */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    {/* Header del componente */}
                    <div className="p-4 border-b border-green-100">
                        <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                            <span className="text-green-500">👥</span> Recolectores Registrados
                        </h2>
                    </div>

                    {/* Tabla */}
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Apellido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Usuario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {collectorUsers.length > 0 ? (
                                        collectorUsers.map((collector) => (
                                            <tr
                                                key={collector.pk_collector_user}
                                                className="hover:bg-green-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                                    {collector.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                    {collector.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                    {collector.phone_number || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                    {collector.fk_user?.username || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                                    <a
                                                        href={`mailto:${collector.fk_user?.email || ""}`}
                                                        className="hover:text-green-800 hover:underline"
                                                    >
                                                        {collector.fk_user?.email || "-"}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(collector.pk_collector_user)}
                                                        className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                                                        title="Editar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(collector.pk_collector_user)}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                                        title="Eliminar"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-green-600">
                                                No se encontraron recolectores registrados
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer del componente */}
                    <div className="p-3 border-t border-green-100 bg-green-50 text-center">
                        <p className="text-xs text-green-600">
                            👥 Mostrando {collectorUsers.length} recolectores registrados
                        </p>
                    </div>
                </div>

                {/* Formulario - Ahora está abajo */}
                <div className="bg-white rounded-lg shadow-sm border border-green-200">
                    <div className="p-4 border-b border-green-100">
                        <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                            <span className="text-green-500">📝</span>
                            {isEditing ? "Editar Recolector" : "Registrar Nuevo Recolector"}
                        </h2>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Collector Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-green-700 mb-2">Información del Recolector</h3>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Nombre *</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.name ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Nombre del recolector"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Apellido *</label>
                                <input
                                    type="text"
                                    {...register("last_name")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.last_name ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Apellido del recolector"
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Teléfono</label>
                                <input
                                    type="text"
                                    {...register("phone_number")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Teléfono (opcional)"
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                )}
                            </div>

                            {/* User Information */}
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-lg font-medium text-green-700 mb-2">Cuenta de Usuario</h3>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Usuario *</label>
                                <input
                                    type="text"
                                    {...register("fk_user.username")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.username ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Nombre de usuario"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.username.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Email *</label>
                                <input
                                    type="email"
                                    {...register("fk_user.email")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.email ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Correo electrónico"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.email.message}</p>
                                )}
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Primer Nombre *</label>
                                <input
                                    type="text"
                                    {...register("fk_user.first_name")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.first_name ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Primer nombre"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.first_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.first_name.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Apellido Usuario *</label>
                                <input
                                    type="text"
                                    {...register("fk_user.last_name")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.last_name ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Apellido del usuario"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.last_name.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Contraseña *</label>
                                <input
                                    type="password"
                                    {...register("fk_user.password")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.password ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Contraseña"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Confirmar Contraseña *</label>
                                <input
                                    type="password"
                                    {...register("fk_user.password2")}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""} ${errors.fk_user?.password2 ? "border-red-500" : "border-green-300"}`}
                                    placeholder="Confirmar contraseña"
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.password2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.password2.message}</p>
                                )}
                                {password && password2 && password !== password2 && (
                                    <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                            >
                                {isEditing ? "Actualizar" : "Registrar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CollectorUsers;