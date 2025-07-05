import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationFormData, locationSchema } from "../../schemas";
import { FormInput } from "./FormInput";
import { FormActions } from "./FormActions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AddLocationForm = () => {
    const navigate = useNavigate();
    const methods = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            interior_number: "",
            email: ""
        }
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
        setError
    } = methods;

    const onSubmit = async (data: LocationFormData) => {
        try {
            console.log("Datos validados:", data);

            const response = await axios.post("/api/locations", data);

            if (response.status === 201) {
                toast.success("Ubicación creada exitosamente");
                reset();
                navigate("/admin/locations");
            }
        } catch (error) {
            console.error("Error al crear ubicación:", error);

            if (axios.isAxiosError(error) && error.response?.data?.errors) {
                // Manejo de errores del backend
                Object.entries(error.response.data.errors).forEach(([field, message]) => {
                    setError(field as keyof LocationFormData, {
                        type: "manual",
                        message: message as string
                    });
                });
                toast.error("Corrige los errores en el formulario");
            } else {
                toast.error("Error al guardar la ubicación");
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-green-50 p-6 rounded-lg shadow">
                <div className="space-y-6">
                    {/* Sección Información Básica */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-green-700 mb-4">
                            Información de la Ubicación
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                name="name"
                                label="Nombre *"
                                placeholder="Ej: Oficina Principal"
                            />

                            <FormInput
                                name="postal_code"
                                label="Código Postal *"
                                placeholder="Ej: 11520"
                            />

                            <FormInput
                                name="exterior_number"
                                label="Número Exterior *"
                                placeholder="Ej: 123"
                            />

                            <FormInput
                                name="interior_number"
                                label="Número Interior"
                                placeholder="Ej: 4B"
                                optional
                            />
                        </div>
                    </div>

                    {/* Sección Dirección */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-green-700 mb-4">
                            Dirección Completa
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                name="street_name"
                                label="Calle *"
                                placeholder="Ej: Av. Reforma"
                            />

                            <FormInput
                                name="neighborhood"
                                label="Colonia/Barrio *"
                                placeholder="Ej: Polanco"
                            />

                            <FormInput
                                name="city"
                                label="Ciudad *"
                                placeholder="Ej: Ciudad de México"
                            />

                            <FormInput
                                name="state"
                                label="Estado *"
                                placeholder="Ej: CDMX"
                            />

                            <FormInput
                                name="country"
                                label="País *"
                                placeholder="Ej: México"
                            />
                        </div>
                    </div>

                    {/* Sección Contacto */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-green-700 mb-4">
                            Información de Contacto
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Ej: contacto@empresa.com"
                                optional
                            />

                            <FormInput
                                name="phone_number"
                                label="Teléfono *"
                                type="tel"
                                placeholder="Ej: +525512345678"
                            />
                        </div>
                    </div>

                    <FormActions
                        isSubmitting={isSubmitting}
                        submitText="Guardar Ubicación"
                        onCancel={() => reset()}
                        cancelText="Limpiar Formulario"
                    />
                </div>
            </form>
        </FormProvider>
    );
};