import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocationFormData, locationSchema } from "../../schemas";
import { FormInput } from "./FormInput";
import { FormActions } from "./FormActions";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../../api";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const AddLocationForm = () => {
    const { pk } = useParams(); // Obtener el ID si estamos editando
    const isEditing = Boolean(pk); // Determinar si estamos en modo edición
    const navigate = useNavigate();

    const methods = useForm<LocationFormData>({
        resolver: zodResolver(locationSchema),
        defaultValues: {
            country: "Mexico",
        }
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
        setError
    } = methods;

    // Cargar datos de la ubicación si estamos editando
    useEffect(() => {
        if (isEditing) {
            const fetchLocationData = async () => {
                try {
                    const response = await api.get(`core/locations/${pk}/`);
                    const parsedData = {
                        ...response.data,
                        interior_number: response.data.interior_number?.toString(),
                        exterior_number: response.data.exterior_number?.toString()
                    }
                    reset(parsedData); // Rellenar el formulario con los datos existentes
                } catch (error) {
                    console.error("Error al cargar la ubicación:", error);
                    toast.error("No se pudo cargar la ubicación para editar");
                    navigate("/admin/locations");
                }
            };
            fetchLocationData();
        }
    }, [pk, isEditing, reset, navigate]);

    const onSubmit = async (data: LocationFormData) => {
        try {
            console.log("Datos validados:", data);

            let response;
            if (isEditing) {
                // Petición PATCH para edición
                response = await api.patch(`core/locations/${pk}/`, data);
                toast.success("Ubicación actualizada exitosamente");
            } else {
                // Petición POST para creación
                response = await api.post("core/locations/", data);
                toast.success("Ubicación creada exitosamente");
            }

            // Redirigir después de 1 segundo para que se vea el toast
            setTimeout(() => navigate("/admin/locations"), 1000);
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} ubicación:`, error);
            toast.error(`Error al ${isEditing ? 'actualizar' : 'guardar'} la ubicación`);

            // Manejo de errores del backend (descomenta cuando lo necesites)
            // if (error.response?.data?.errors) {
            //     Object.entries(error.response.data.errors).forEach(([field, message]) => {
            //         setError(field as keyof LocationFormData, {
            //             type: "manual",
            //             message: message as string
            //         });
            //     });
            //     toast.error("Corrige los errores en el formulario");
            // }
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-green-50 p-6 rounded-lg shadow">
                <h1 className="text-2xl font-bold text-green-800 mb-6">
                    {isEditing ? 'Editar Ubicación' : 'Agregar Nueva Ubicación'}
                </h1>

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
                                name="postcode"
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
                                name="phone_number"
                                label="Teléfono *"
                                type="tel"
                                placeholder="Ej: +525512345678"
                            />
                        </div>
                    </div>
                    <FormActions
                        isSubmitting={isSubmitting}
                        submitText={isEditing ? "Actualizar Ubicación" : "Guardar Ubicación"}
                        onCancel={() => {
                            reset();
                            toast.info("Formulario limpiado");
                        }}
                        cancelText="Limpiar Formulario"
                        onSubmit={methods.handleSubmit(onSubmit)} // Pasa el manejador directamente
                    />
                </div>
            </form>
        </FormProvider>
    );
};