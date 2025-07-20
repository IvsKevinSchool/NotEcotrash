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
            const data = await getCollectorUsers();
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
        reset();
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Collector Registration</h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        {isEditing ? "Edit Collector" : "Register New Collector"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Collector Information */}
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-green-700 mb-2">Collector Information</h3>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-green-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-green-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    {...register("last_name")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-green-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    {...register("phone_number")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Optional"
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                )}
                            </div>

                            {/* User Information */}
                            <div className="md:col-span-2 mt-4">
                                <h3 className="text-lg font-medium text-green-700 mb-2">User Account</h3>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-green-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    {...register("fk_user.username")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.username.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-green-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("fk_user.email")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.email.message}</p>
                                )}
                            </div>

                            {/* First Name */}
                            <div>
                                <label className="block text-green-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    {...register("fk_user.first_name")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.first_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.first_name.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-green-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    {...register("fk_user.last_name")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.last_name.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-green-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    {...register("fk_user.password")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-green-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    {...register("fk_user.password2")}
                                    className={`w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${isEditing ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={isEditing}
                                />
                                {errors.fk_user?.password2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.password2.message}</p>
                                )}
                                {password && password2 && password !== password2 && (
                                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                {isEditing ? "Update" : "Register"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Registered Collectors</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-green-200">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Last Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {collectorUsers.map((collector) => (
                                        <tr key={collector.pk_collector_user} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{collector.pk_collector_user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{collector.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{collector.last_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{collector.phone_number || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {collector.fk_user?.username || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {collector.fk_user?.email || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(collector.pk_collector_user)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(collector.pk_collector_user)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectorUsers;