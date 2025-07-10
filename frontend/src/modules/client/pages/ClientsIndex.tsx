import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ClientFormData, clientSchema } from "../schemas/clientSchema";
import {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    toggleClientStatus,
} from "../services/clientService";

const ClientsIndex = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [managements, setManagements] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    // Fetch initial data
    useEffect(() => {
        fetchData();
        // In a real app, you would fetch managements from API
        setManagements([
            { pk_management: 1, name: "Management 1" },
            { pk_management: 2, name: "Management 2" },
        ]);
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            toast.error("Error fetching clients");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ClientFormData) => {
        try {
            if (isEditing && currentId) {
                await updateClient(currentId, data);
                toast.success("Client updated successfully");
            } else {
                await createClient(data);
                toast.success("Client created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving client:", error);
            toast.error("Error saving client");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const client = await getClient(id);
            reset(client);
            setIsEditing(true);
            setCurrentId(id);
        } catch (error) {
            toast.error("Error fetching client for edit");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await deleteClient(id);
                toast.success("Client deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Error deleting client");
            }
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await toggleClientStatus(id);
            toast.success("Client status updated");
            fetchData();
        } catch (error) {
            toast.error("Error updating client status");
        }
    };

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Clients Management</h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        {isEditing ? "Edit Client" : "Add New Client"}
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

                            {/* Legal Name */}
                            <div>
                                <label className="block text-green-700 mb-1">Legal Name</label>
                                <input
                                    type="text"
                                    {...register("legal_name")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.legal_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.legal_name.message}</p>
                                )}
                            </div>

                            {/* RFC */}
                            <div>
                                <label className="block text-green-700 mb-1">RFC</label>
                                <input
                                    type="text"
                                    {...register("rfc")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.rfc && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-green-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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

                            {/* Phone Number 2 */}
                            <div>
                                <label className="block text-green-700 mb-1">Secondary Phone</label>
                                <input
                                    type="text"
                                    {...register("phone_number_2")}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Optional"
                                />
                                {errors.phone_number_2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number_2.message}</p>
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
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Clients List</h2>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Legal Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">RFC</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {clients.map((client) => (
                                        <tr key={client.pk_client} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{client.pk_client}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{client.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{client.legal_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{client.rfc}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${client.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {client.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(client.pk_client)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(client.pk_client)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    {client.is_active ? "Deactivate" : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.pk_client)}
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

export default ClientsIndex;