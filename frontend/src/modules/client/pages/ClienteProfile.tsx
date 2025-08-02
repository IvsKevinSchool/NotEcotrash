import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { clientProfileSchema } from "../schemas/clientProfileSchema";
import { getClientProfile, updateClientProfile } from "../services/clientProfileService";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

type ClientProfileFormData = z.infer<typeof clientProfileSchema>;

export const ClienteProfile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clientId, setClientId] = useState<number | null>(null);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ClientProfileFormData>({
        resolver: zodResolver(clientProfileSchema),
    });

    useEffect(() => {
        const fetchClientId = async () => {
            setClientId(user.id);
            fetchClientProfile(user.id);
        };

        fetchClientId();
    }, []);

    const fetchClientProfile = async (id: number) => {
        try {
            setIsLoading(true);
            const data = await getClientProfile(id);
            reset({
                name: data.name,
                legal_name: data.legal_name,
                rfc: data.rfc,
                email: data.email,
                phone_number: data.phone_number,
                phone_number_2: data.phone_number_2 || "",
                is_active: data.is_active,
            });
        } catch (error) {
            toast.error("Error al cargar el perfil");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (formData: ClientProfileFormData) => {
        if (!clientId) return;

        try {
            setIsSubmitting(true);
            await updateClientProfile(clientId, formData);
            toast.success("Perfil actualizado correctamente");
            // Opcional: refrescar los datos después de actualizar
            await fetchClientProfile(clientId);
        } catch (error) {
            toast.error("Error al actualizar el perfil");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header ecológico */}
                <div className="bg-green-600 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white">Perfil del Cliente</h1>
                    <p className="text-green-100">Administra la información de tu perfil</p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Sección de Información Básica */}
                    <div className="border-b border-green-200 pb-6">
                        <h2 className="text-lg font-medium text-green-800 mb-4">Información Básica</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-green-700">
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            </div>

                            {/* Nombre Legal */}
                            <div>
                                <label htmlFor="legal_name" className="block text-sm font-medium text-green-700">
                                    Nombre Legal
                                </label>
                                <input
                                    id="legal_name"
                                    type="text"
                                    {...register("legal_name")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                                {errors.legal_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.legal_name.message}</p>
                                )}
                            </div>

                            {/* RFC */}
                            <div>
                                <label htmlFor="rfc" className="block text-sm font-medium text-green-700">
                                    RFC
                                </label>
                                <input
                                    id="rfc"
                                    type="text"
                                    {...register("rfc")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                                {errors.rfc && <p className="mt-1 text-sm text-red-600">{errors.rfc.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-green-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sección de Contacto */}
                    <div className="border-b border-green-200 pb-6">
                        <h2 className="text-lg font-medium text-green-800 mb-4">Información de Contacto</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Teléfono Principal */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-green-700">
                                    Teléfono Principal
                                </label>
                                <input
                                    id="phone_number"
                                    type="tel"
                                    {...register("phone_number")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                                )}
                            </div>

                            {/* Teléfono Secundario */}
                            <div>
                                <label htmlFor="phone_number_2" className="block text-sm font-medium text-green-700">
                                    Teléfono Secundario (Opcional)
                                </label>
                                <input
                                    id="phone_number_2"
                                    type="tel"
                                    {...register("phone_number_2")}
                                    className="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Estado */}
                    <div className="flex items-center">
                        <input
                            id="is_active"
                            type="checkbox"
                            {...register("is_active")}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-green-700">
                            Cliente activo
                        </label>
                    </div>
                    {errors.is_active && (
                        <p className="mt-1 text-sm text-red-600">{errors.is_active.message}</p>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Restablecer
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </button>
                    </div>
                </form>

                {/* Pie de página ecológico */}
                <div className="bg-green-50 py-3 px-6 text-center">
                    <p className="text-xs text-green-600">
                        Cuidamos el medio ambiente - Este sistema ahorra papel mediante la digitalización de procesos
                    </p>
                </div>
            </div>
        </div>
    );
};