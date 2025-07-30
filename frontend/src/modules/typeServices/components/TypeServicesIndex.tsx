import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { TypeServiceFormData, typeServiceSchema } from "../schemas/typeServiceSchema";
import {
    getTypeServices,
    getTypeService,
    createTypeService,
    updateTypeService,
    deleteTypeService,
} from "../services/typeServiceService";
import { useAuth } from "../../../context/AuthContext";

const TypeServicesIndex = () => {
    const [typeServices, setTypeServices] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TypeServiceFormData>({
        resolver: zodResolver(typeServiceSchema),
    });

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getTypeServices();
            setTypeServices(data);
        } catch (error) {
            toast.error("Error fetching type services");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: TypeServiceFormData) => {
        try {
            const newData = { ...data, fk_management: user?.id || data.fk_management };
            if (isEditing && currentId) {
                await updateTypeService(currentId, newData);
                toast.success("Type service updated successfully");
            } else {
                await createTypeService(newData, user?.id);
                toast.success("Type service created successfully");
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving type service:", error);
            toast.error("Error saving type service");
        }
    };

    const handleEdit = async (id: number) => {
        try {
            const typeService = await getTypeService(id);
            reset(typeService);
            setIsEditing(true);
            setCurrentId(id);
        } catch (error) {
            toast.error("Error fetching type service for edit");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this type service?")) {
            try {
                await deleteTypeService(id);
                toast.success("Type service deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Error deleting type service");
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
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Type Services Management</h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <h2 className="text-xl font-semibold text-green-700 mb-4">
                        {isEditing ? "Edit Type Service" : "Add New Type Service"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-green-700 mb-1">Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={3}
                                    className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
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
                    <h2 className="text-xl font-semibold text-green-700 mb-4">Type Services List</h2>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Management</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-green-200">
                                    {typeServices.map((service) => (
                                        <tr key={service.pk_type_services} className="hover:bg-green-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{service.pk_type_services}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{service.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                                {service.fk_management}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-green-900">
                                                {service.description || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(service.pk_type_services)}
                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(service.pk_type_services)}
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

export default TypeServicesIndex;