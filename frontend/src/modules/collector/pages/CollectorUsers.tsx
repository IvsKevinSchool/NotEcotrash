import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CollectorUserFormData, collectorUserSchema } from "../schemas/collectorUserSchema";
import {
    getCollectorUsers,
    getCollectorUser,
    createCollectorUser,
    updateCollectorUser,
    deleteCollectorUser,
} from "../services/collectorUserService";

const CollectorUsers = () => {
    const [collectorUsers, setCollectorUsers] = useState<any[]>([]);
    const [managements, setManagements] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CollectorUserFormData>({
        resolver: zodResolver(collectorUserSchema),
    });

    // Fetch initial data
    useEffect(() => {
        fetchData();
        // In a real app, you would fetch managements and users from their respective APIs
        setManagements([{ pk_management: 2, name: "Management 1" }]);
        setUsers([{ pk_user: 1, username: "user1" }]);
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
                await createCollectorUser(data);
                toast.success("Collector user created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving collector user:", error);
            toast.error("Error saving collector user");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const collectorUser = await getCollectorUser(id);
            reset(collectorUser);
            setIsEditing(true);
            setCurrentId(id);
        } catch (error) {
            toast.error("Error fetching collector user for edit");
        }
    };

    const handleDelete = (id: number) => {
        const toastId = toast.info(
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2">¿Estás seguro?</h3>
                <p className="mb-4">Esta acción eliminará permanentemente al recolector.</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => {
                            toast.dismiss(toastId);
                            confirmDelete(id);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastId)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "top-right",
                autoClose: false,
                closeButton: false,
                closeOnClick: false,
                draggable: false,
                className: "w-full max-w-md",
            }
        );
    };

    const confirmDelete = async (id: number) => {
        try {
            await deleteCollectorUser(id);
            toast.success("Collector user deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Error deleting collector user");
        }
    };

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <ToastContainer />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Collector Users Management</h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        {isEditing ? "Edit Collector User" : "Add New Collector User"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Management Select */}
                            <div>
                                <label className="block text-green-700 mb-1">Management</label>
                                <select
                                    {...register("fk_management", { valueAsNumber: true })}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select Management</option>
                                    {managements.map((mgmt) => (
                                        <option key={mgmt.pk_management} value={mgmt.pk_management}>
                                            {mgmt.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.fk_management && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_management.message}</p>
                                )}
                            </div>

                            {/* User Select */}
                            <div>
                                <label className="block text-green-700 mb-1">User</label>
                                <select
                                    {...register("fk_user", { valueAsNumber: true })}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select User</option>
                                    {users.map((user) => (
                                        <option key={user.pk_user} value={user.pk_user}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                                {errors.fk_user && (
                                    <p className="text-red-500 text-sm mt-1">{errors.fk_user.message}</p>
                                )}
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
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                {isEditing ? "Update" : "Save"}
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
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Collector Users List</h2>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Management</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {collectorUsers.map((user) => (
                                        <tr key={user.pk_collector_user} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{user.pk_collector_user}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{user.last_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{user.phone_number || "-"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {managements.find(m => m.pk_management === user.fk_management)?.name || user.fk_management}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {users.find(u => u.pk_user === user.fk_user)?.username || user.fk_user}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(user.pk_collector_user)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.pk_collector_user)}
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