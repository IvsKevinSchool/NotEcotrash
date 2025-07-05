import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wasteSubcategorySchema, WasteSubcategoryFormValues } from "../schemas/wasteSchema";
import { useEffect, useState } from "react";
import { wasteService } from "../services/wasteService";
import { toast } from "react-toastify";
import { ArrowPathIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface WasteSubcategoryFormProps {
    onSubmit: (data: WasteSubcategoryFormValues) => Promise<void> | void;
    isSubmitting: boolean;
}

export const WasteSubcategoryForm = ({ onSubmit, isSubmitting }: WasteSubcategoryFormProps) => {
    const [wastes, setWastes] = useState<{ pk_waste: string; name: string }[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<WasteSubcategoryFormValues>({
        resolver: zodResolver(wasteSubcategorySchema) as any,
        defaultValues: {
            is_active: true,
            fk_waste: "",
            name: "",
            description: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        const fetchWastes = async () => {
            try {
                const data = await wasteService.getWastes();
                setWastes(data);
            } catch (error) {
                toast.error("Error al cargar los residuos");
                console.error("Error fetching wastes:", error);
            }
        };
        fetchWastes();
    }, []);

    const handleFormSubmit = async (data: WasteSubcategoryFormValues) => {
        try {
            await onSubmit(data);
        } catch (error) {
            toast.error("Error al enviar el formulario");
            console.error("Submission error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-green-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <ArrowPathIcon className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-bold text-green-700">Nueva Subcategoría de Residuo</h2>
            </div>

            {/* Campo Residuo */}
            <div className="space-y-2">
                <label htmlFor="fk_waste" className="block text-sm font-medium text-green-700">
                    Residuo Principal *
                </label>
                <div className="relative">
                    <select
                        id="fk_waste"
                        {...register("fk_waste")}
                        disabled={isSubmitting}
                        className={`block w-full pl-3 pr-10 py-2 text-base border ${errors.fk_waste ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-green-300 focus:ring-green-500 focus:border-green-500"
                            } rounded-lg shadow-sm`}
                    >
                        <option value="">Seleccione un residuo</option>
                        {wastes.map((waste) => (
                            <option key={waste.pk_waste} value={waste.pk_waste}>
                                {waste.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400 pointer-events-none" />
                </div>
                {errors.fk_waste && (
                    <p className="mt-1 text-sm text-red-600">{errors.fk_waste.message}</p>
                )}
            </div>

            {/* Campo Nombre */}
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-green-700">
                    Nombre de la Subcategoría *
                </label>
                <input
                    id="name"
                    type="text"
                    {...register("name")}
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 border ${errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                        } rounded-lg shadow-sm`}
                    placeholder="Ej: Botellas PET"
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
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 border ${errors.description ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                        } rounded-lg shadow-sm`}
                    placeholder="Descripción detallada de la subcategoría"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            {/* Campo Activo */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-green-700">
                    Subcategoría activa (disponible para selección)
                </label>
            </div>

            {/* Botón de envío */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting || !isValid
                        ? "bg-green-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </span>
                    ) : (
                        "Registrar Subcategoría"
                    )}
                </button>
            </div>
        </form>
    );
};