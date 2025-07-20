import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getCollectorUser, updateCollectorUser } from "../services/collectorUserService";
import { editCollectorSchema, EditCollectorFormData } from "../schemas/collectorUserSchema";
import { handleApiError } from "../../../components/handleApiError";

const EditCollector = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditCollectorFormData>({
        resolver: zodResolver(editCollectorSchema),
        defaultValues: {
            phone_number: "",
        },
    });

    useEffect(() => {
        const fetchCollectorData = async () => {
            setIsLoading(true);
            try {
                if (!id) {
                    toast.error("No collector ID provided");
                    navigate("/collectors");
                    return;
                }

                const collector = await getCollectorUser(parseInt(id));
                //console.log("Fetched collector data:", collector);
                reset({
                    name: collector.name,
                    last_name: collector.last_name,
                    phone_number: collector.phone_number || "",
                });
            } catch (error) {
                toast.error("Error fetching collector data");
                navigate("/collectors");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollectorData();
    }, [id, reset, navigate]);

    const onSubmit = async (data: EditCollectorFormData) => {
        console.log("Form data to submit:", data);
        try {
            if (!id) return;

            setIsLoading(true);
            await updateCollectorUser(parseInt(id), data);
            toast.success("Collector updated successfully");
            navigate("/collectors");
        } catch (error) {
            console.error("Error updating collector:", error);
            handleApiError(error, "Error updating collector");
            // toast.error("Error updating collector");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/management/collector");
    };

    return (
        <div className="min-h-screen bg-green-50 p-6">
            <div className="mx-auto max-w-2xl">
                <h1 className="text-3xl font-bold text-green-800 mb-8">Edit Collector</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-green-700 mb-2">Collector Information</h3>
                            </div>

                            <div>
                                <label className="block text-green-700 mb-1">Name*</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    className={`w-full p-2 border ${errors.name ? "border-red-500" : "border-green-300"
                                        } rounded focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-green-700 mb-1">Last Name*</label>
                                <input
                                    type="text"
                                    {...register("last_name")}
                                    className={`w-full p-2 border ${errors.last_name ? "border-red-500" : "border-green-300"
                                        } rounded focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                    disabled={isLoading}
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-green-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    {...register("phone_number")}
                                    className={`w-full p-2 border ${errors.phone_number ? "border-red-500" : "border-green-300"
                                        } rounded focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                                    placeholder="+1 (123) 456-7890"
                                    disabled={isLoading}
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Updating..." : "Update Collector"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCollector;