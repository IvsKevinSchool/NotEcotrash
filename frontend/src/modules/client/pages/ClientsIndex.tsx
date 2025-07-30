import { useState, useEffect, use } from "react";
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
import { useAuth } from "../../../context/AuthContext";
import { handleApiError } from "../../../components/handleApiError";

const ClientsIndex = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false); // Nuevo estado para mostrar/ocultar formulario
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
    });

    useEffect(() => {
        // Solo ejecutar fetchData cuando el usuario esté disponible
        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    const fetchData = async () => {
        if (!user?.id) {
            console.error("User ID no disponible");
            toast.error("Usuario no identificado. Por favor, inicia sesión nuevamente.");
            return;
        }

        setIsLoading(true);
        try {
            console.log("Fetching clients for management ID:", user.id);
            const data = await getClients(user.id);
            console.log("Clients data received:", data);
            setClients(data);
        } catch (error) {
            console.error("Error fetching clients:", error);
            toast.error("Error al cargar clientes. Verifica tu conexión.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ClientFormData) => {
        try {
            const payload = {
                ...data,
                fk_management: user?.id,
                phone_number_2: data.phone_number_2 ?? ""
            };
            if (!payload.fk_management) {
                toast.error("Management ID is required");
                return;
            }
            if (isEditing && currentId) {
                await updateClient(currentId, payload);
                toast.success("Client updated successfully");
            } else {
                await createClient(payload);
                toast.success("Client created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            handleApiError(error, "Error saving client");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const client = await getClient(id);
            reset({
                ...client,
                phone_number_2: client.phone_number_2 ?? "", // Convierte null a ""
            });
            setIsEditing(true);
            setCurrentId(id);
            setShowForm(true); // Mostrar formulario al editar
        } catch (error) {
            handleApiError(error, "Error updating client");
        }
    };

    const handleAddNew = () => {
        reset(); // Limpiar todos los campos del formulario
        setIsEditing(false); // Asegurar que no está en modo edición
        setCurrentId(null); // Limpiar ID actual
        setShowForm(true); // Mostrar formulario para agregar nuevo
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await deleteClient(id);
                toast.success("Client deleted successfully");
                fetchData();
            } catch (error) {
                handleApiError(error, "Error deleting client");
            }
        }
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await toggleClientStatus(id);
            toast.success("Client status updated");
            fetchData();
        } catch (error) {
            handleApiError(error, "Error updating client status");
        }
    };

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
        setShowForm(false); // Ocultar formulario al resetear
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-800">Admin - Client Management</h1>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Add New Client
                    </button>
                )}
            </div>

            {/* Conditional Rendering: Form or Table */}
            {showForm ? (
                // Form View
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-green-700">
                            {isEditing ? "Edit Client" : "Add New Client"}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        >
                            ← Back to List
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Name *</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter client name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Legal Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Legal Name *</label>
                                <input
                                    type="text"
                                    {...register("legal_name")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter legal name"
                                />
                                {errors.legal_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.legal_name.message}</p>
                                )}
                            </div>

                            {/* RFC */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">RFC *</label>
                                <input
                                    type="text"
                                    maxLength={13}
                                    {...register("rfc")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter RFC (13 characters)"
                                />
                                {errors.rfc && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Email *</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    {...register("phone_number")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter main phone number"
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                )}
                            </div>

                            {/* Phone Number 2 */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Secondary Phone</label>
                                <input
                                    type="text"
                                    {...register("phone_number_2")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter secondary phone (optional)"
                                />
                                {errors.phone_number_2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number_2.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-6 border-t border-green-200">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                {isEditing ? "Update Client" : "Save Client"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Table View
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <h2 className="text-2xl font-semibold text-green-700 mb-6">Registered Clients</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                        </div>
                    ) : clients.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl text-green-300 mb-4">👥</div>
                            <h3 className="text-xl font-medium text-green-600 mb-2">No clients registered yet</h3>
                            <p className="text-green-500 mb-6">Start by adding your first client to the system</p>
                            <button
                                onClick={handleAddNew}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add First Client
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto shadow-sm rounded-lg">
                            <table className="min-w-full divide-y divide-green-200 table-fixed">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="w-16 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">ID</th>
                                        <th className="w-32 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Name</th>
                                        <th className="w-32 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Legal Name</th>
                                        <th className="w-24 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">RFC</th>
                                        <th className="w-40 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Email</th>
                                        <th className="w-20 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Status</th>
                                        <th className="w-32 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-100">
                                    {clients.map((client) => (
                                        <tr key={client.pk_client} className="hover:bg-green-50 transition-colors">
                                            <td className="px-3 py-4 text-sm font-medium text-green-900 truncate">#{client.pk_client}</td>
                                            <td className="px-3 py-4 text-sm text-green-900 font-medium truncate" title={client.name}>
                                                {client.name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 truncate" title={client.legal_name}>
                                                {client.legal_name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 font-mono truncate" title={client.rfc}>
                                                {client.rfc}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 truncate" title={client.email}>
                                                {client.email}
                                            </td>
                                            <td className="px-3 py-4 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${client.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {client.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm font-medium">
                                                <div className="flex flex-col space-y-1">
                                                    <button
                                                        onClick={() => handleEdit(client.pk_client)}
                                                        className="text-green-600 hover:text-green-900 font-medium hover:underline text-left"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(client.pk_client)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium hover:underline text-left"
                                                    >
                                                        {client.is_active ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(client.pk_client)}
                                                        className="text-red-600 hover:text-red-900 font-medium hover:underline text-left"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClientsIndex;