import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ManagementService } from "../../management/services/managementService";
import { ManagementFormValues, managementFormSchema } from "../../management/schemas/managementSchema";
import { useAuth } from "../../../context/AuthContext";
import { handleApiError } from "../../../components/handleApiError";

interface ManagementUser {
    pk_management: string;
    name: string;
    email: string;
    phone_number?: string;
    phone_number_2?: string;
    rfc?: string;
    created_at?: string;
    is_active?: boolean;
}

const ManagementManager = () => {
    const [managements, setManagements] = useState<ManagementUser[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ManagementFormValues>({
        resolver: zodResolver(managementFormSchema),
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await ManagementService.getAll();
            console.log("Management data received:", data);
            setManagements(data);
        } catch (error) {
            console.error("Error fetching managements:", error);
            toast.error("Error al cargar empresas de gestión.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ManagementFormValues) => {
        try {
            if (isEditing && currentId) {
                await ManagementService.update(currentId, data);
                toast.success("Management company updated successfully");
            } else {
                await ManagementService.create(data);
                toast.success("Management company created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            handleApiError(error, "Error saving management company");
        }
    };

    const handleEdit = async (id: string) => {
        try {
            const management = await ManagementService.getById(id);
            reset({
                name: management.name,
                email: management.email,
                phone_number: management.phone_number || "",
                phone_number_2: management.phone_number_2 || "",
                rfc: management.rfc || "",
            });
            setIsEditing(true);
            setCurrentId(id);
            setShowForm(true);
        } catch (error) {
            handleApiError(error, "Error loading management data");
        }
    };

    const handleAddNew = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta empresa de gestión?")) {
            try {
                await ManagementService.delete(id);
                toast.success("Management company deleted successfully");
                fetchData();
            } catch (error) {
                handleApiError(error, "Error deleting management company");
            }
        }
    };

    const resetForm = () => {
        reset();
        setIsEditing(false);
        setCurrentId(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-green-800">Admin - Management Companies</h1>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <span className="text-xl">+</span>
                        Add New Management Company
                    </button>
                )}
            </div>

            {/* Conditional Rendering: Form or Table */}
            {showForm ? (
                // Form View
                <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-green-700">
                            {isEditing ? "Edit Management Company" : "Add New Management Company"}
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

                            {/* Company Name */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Company Name *</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter company name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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

                            {/* RFC */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">RFC *</label>
                                <input
                                    type="text"
                                    maxLength={13}
                                    {...register("rfc")}
                                    className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Enter RFC (12-13 characters)"
                                />
                                {errors.rfc && (
                                    <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-green-700 mb-1 font-medium">Phone Number *</label>
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
                            <div className="md:col-span-2">
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
                                {isEditing ? "Update Company" : "Create Management Company"}
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
                    <h2 className="text-2xl font-semibold text-green-700 mb-6">Management Companies</h2>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                        </div>
                    ) : managements.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl text-green-300 mb-4">🏢</div>
                            <h3 className="text-xl font-medium text-green-600 mb-2">No management companies registered yet</h3>
                            <p className="text-green-500 mb-6">Start by adding your first management company to the system</p>
                            <button
                                onClick={handleAddNew}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Add First Company
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto shadow-sm rounded-lg">
                            <table className="min-w-full divide-y divide-green-200 table-fixed">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="w-16 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">ID</th>
                                        <th className="w-40 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Company Name</th>
                                        <th className="w-32 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Email</th>
                                        <th className="w-24 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">RFC</th>
                                        <th className="w-28 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Phone</th>
                                        <th className="w-24 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Created</th>
                                        <th className="w-32 px-3 py-4 text-left text-xs font-bold text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-100">
                                    {managements.map((management) => (
                                        <tr key={management.pk_management} className="hover:bg-green-50 transition-colors">
                                            <td className="px-3 py-4 text-sm font-medium text-green-900 truncate">#{management.pk_management}</td>
                                            <td className="px-3 py-4 text-sm text-green-900 font-medium truncate" title={management.name}>
                                                {management.name}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 truncate" title={management.email}>
                                                {management.email}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 font-mono truncate" title={management.rfc}>
                                                {management.rfc || "N/A"}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 truncate" title={management.phone_number}>
                                                {management.phone_number || "N/A"}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-green-700 truncate">
                                                {management.created_at ? new Date(management.created_at).toLocaleDateString() : "N/A"}
                                            </td>
                                            <td className="px-3 py-4 text-sm font-medium">
                                                <div className="flex flex-col space-y-1">
                                                    <button
                                                        onClick={() => handleEdit(management.pk_management)}
                                                        className="text-green-600 hover:text-green-900 font-medium hover:underline text-left"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(management.pk_management)}
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

export default ManagementManager;
