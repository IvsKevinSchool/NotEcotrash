import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { wasteSchema, WasteFormValues } from "../schemas/wasteSchema";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface WasteFormProps {
    onSubmit: (data: WasteFormValues) => Promise<void>;
    isSubmitting: boolean;
}

export const WasteForm = ({ onSubmit, isSubmitting }: WasteFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<WasteFormValues>({
        resolver: zodResolver(wasteSchema) as any,
        defaultValues: {
            is_active: true,
        },
        mode: "onChange",
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-green-50 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <ArrowPathIcon className="h-8 w-8 text-green-600" />
                <h2 className="text-xl font-bold text-green-700">Nuevo Tipo de Residuo</h2>
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
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 border ${errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500"
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
                    disabled={isSubmitting}
                    className={`block w-full px-3 py-2 border ${errors.description ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                        } rounded-lg shadow-sm`}
                    placeholder="Descripción del tipo de residuo"
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
                    Residuo activo (disponible para selección)
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
                        "Registrar Residuo"
                    )}
                </button>
            </div>
        </form>
    );
};