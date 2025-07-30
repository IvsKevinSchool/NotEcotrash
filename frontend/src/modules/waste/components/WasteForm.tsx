import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { wasteSchema, WasteFormValues } from "../schemas/wasteSchema";
import { useWastes } from "../hooks/useWastes";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { handleApiError } from "../../../components/handleApiError";

export const WasteForm = () => {
    const { pk } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(pk);
    const { createWaste, updateWaste, fetchOneWaste } = useWastes();

    const [loadingFetch, setLoadingFetch] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const { user } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
    } = useForm<WasteFormValues>({
        resolver: zodResolver(wasteSchema) as any,
        defaultValues: {
            name: '',
            description: '',
            is_active: true // Valor por defecto
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchData = async () => {
            if (isEditing && pk) {
                try {
                    setLoadingFetch(true);
                    const waste = await fetchOneWaste(pk);
                    if (waste) {
                        reset({
                            name: waste.name || '',
                            description: waste.description || '',
                            is_active: waste.is_active // Asignamos el valor del backend
                        });
                    }
                } catch (error) {
                    console.error("Error al obtener el residuo:", error);
                } finally {
                    setLoadingFetch(false);
                }
            }
        };
        fetchData();
    }, [isEditing, pk]); // ❌ Quitamos "reset" del array de dependencias

    const onSubmit = async (data: WasteFormValues) => {
        try {
            setLoadingSubmit(true);
            if (isEditing && pk) {
                await updateWaste(user.id, pk, data);
            } else {
                await createWaste(data, user.id);
                reset();
            }
            navigate("/admin/wastes");
        } catch (error) {
            handleApiError(error, "Error al guardar el residuo");
        } finally {
            setLoadingSubmit(false);
        }
    };

    const isActive = watch("is_active"); // Para observar el valor del campo

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-green-50 p-6 rounded-lg shadow-md"
        >
            <div className="flex items-center gap-2 mb-4">
                <ArrowPathIcon className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-bold text-green-700">
                    {isEditing ? "Editar Tipo de Residuo" : "Nuevo Tipo de Residuo"}
                </h2>
            </div>

            {/* Campo Nombre */}
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-green-700">
                    Nombre del Residuo *
                </label>
                <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`block w-full px-3 py-2 border ${errors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                        } rounded-lg shadow-sm`}
                    placeholder="Ej: Plásticos"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            {/* Campo Descripción */}
            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-green-700">
                    Descripción
                </label>
                <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    className={`block w-full px-3 py-2 border ${errors.description
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                        } rounded-lg shadow-sm`}
                    placeholder="Descripción del tipo de residuo"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            {/* Campo is_active (Activo) */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-green-700">
                    Estado
                </label>
                <div className="flex items-center">
                    <input
                        id="is_active"
                        type="checkbox"
                        {...register("is_active")}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        {isActive ? "Activo" : "Inactivo"}
                    </label>
                </div>
                {errors.is_active && (
                    <p className="mt-1 text-sm text-red-600">{errors.is_active.message}</p>
                )}
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loadingSubmit || !isValid}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loadingSubmit || !isValid
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        }`}
                >
                    {loadingSubmit ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </span>
                    ) : (
                        isEditing ? "Actualizar Residuo" : "Registrar Residuo"
                    )}
                </button>
            </div>
        </form>
    );
};