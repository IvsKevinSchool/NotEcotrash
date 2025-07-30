import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { FormInput } from "./FormInput";
import { FormSection } from "./FormSection";
import api from "../../../../api";
import { managementLocationSchema, ManagementLocationFormData, transformLocationData } from "../../schemas";
import { useAuth } from "../../../../context/AuthContext";
import { handleApiError } from "../../../../components/handleApiError";

export const AddLocationForm = () => {
    const { pk } = useParams();
    const id = Number(pk);
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();
    const URL = `management/management/${user.id}/locations/`;

    const methods = useForm<ManagementLocationFormData>({
        resolver: zodResolver(managementLocationSchema),
        defaultValues: {
            is_main: false,
            fk_location: {
                name: "",
                postcode: "",
                exterior_number: "",
                interior_number: "",
                street_name: "",
                neighborhood: "",
                city: "",
                state: "",
                country: "Mexico",
                phone_number: "",
            }
        },
        mode: "onTouched"
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
        setError
    } = methods;

    // Cargar datos si estamos editando
    useEffect(() => {
        if (isEditing) {
            const fetchLocationData = async () => {
                try {
                    const response = await api.get(`management/management/${user.id}/locations/${id}/`);
                    const data = {
                        is_main: response.data.is_main,
                        fk_location: transformLocationData(response.data.fk_location)
                    };
                    reset(data);
                } catch (error) {
                    console.error("Error al cargar la ubicación:", error);
                    toast.error("No se pudo cargar la ubicación para editar");
                    navigate("/admin/locations");
                }
            };
            fetchLocationData();
        }
    }, [id, isEditing, reset, navigate, user.id]);

    const onSubmit: SubmitHandler<ManagementLocationFormData> = async (data) => {
        try {
            console.log("Datos validados:", data);

            if (isEditing) {
                await api.patch(`management/management/${user.id}/locations/${id}/`, data);
                toast.success("Ubicación actualizada exitosamente");
            } else {
                await api.post(URL, data);
                toast.success("Ubicación creada exitosamente");
            }

            setTimeout(() => navigate("/admin/locations"), 1000);
        } catch (error) {
            console.error(error);
            handleApiError(error, `Error al ${isEditing ? 'actualizar' : 'crear'} ubicación:`,)
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-green-50 p-6 rounded-lg shadow space-y-6">
                <h1 className="text-2xl font-bold text-green-800">
                    {isEditing ? 'Editar Ubicación' : 'Agregar Nueva Ubicación'}
                </h1>

                {/* Checkbox para is_main */}
                <div className="flex items-center">
                    <input
                        id="is_main"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        {...methods.register("is_main")}
                    />
                    <label htmlFor="is_main" className="ml-2 block text-sm text-gray-900">
                        ¿Es la ubicación principal?
                    </label>
                </div>

                {/* Sección Información Básica */}
                <FormSection
                    title="Información de la Ubicación"
                    icon={BuildingOfficeIcon}
                >
                    <FormInput
                        name="fk_location.name"
                        label="Nombre *"
                        placeholder="Ej: Oficina Principal"
                    />
                    <FormInput
                        name="fk_location.postcode"
                        label="Código Postal *"
                        placeholder="Ej: 11520"
                        inputMode="numeric"
                    />
                    <FormInput
                        name="fk_location.exterior_number"
                        label="Número Exterior *"
                        placeholder="Ej: 123"
                        inputMode="numeric"
                    />
                    <FormInput
                        name="fk_location.interior_number"
                        label="Número Interior"
                        placeholder="Ej: 4B"
                        optional
                        inputMode="numeric"
                    />
                </FormSection>

                {/* Sección Dirección */}
                <FormSection
                    title="Dirección Completa"
                    icon={MapPinIcon}
                >
                    <FormInput
                        name="fk_location.street_name"
                        label="Calle *"
                        placeholder="Ej: Av. Reforma"
                    />
                    <FormInput
                        name="fk_location.neighborhood"
                        label="Colonia/Barrio *"
                        placeholder="Ej: Polanco"
                    />
                    <FormInput
                        name="fk_location.city"
                        label="Ciudad *"
                        placeholder="Ej: Ciudad de México"
                    />
                    <FormInput
                        name="fk_location.state"
                        label="Estado *"
                        placeholder="Ej: CDMX"
                    />
                    <FormInput
                        name="fk_location.country"
                        label="País *"
                        placeholder="Ej: México"
                    />
                </FormSection>

                {/* Sección Contacto */}
                <FormSection
                    title="Información de Contacto"
                    icon={PhoneIcon}
                >
                    <FormInput
                        name="fk_location.phone_number"
                        label="Teléfono *"
                        type="tel"
                        placeholder="Ej: +525512345678"
                        inputMode="tel"
                    />
                </FormSection>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isEditing ? "Actualizando..." : "Guardando..."}
                            </span>
                        ) : isEditing ? "Actualizar Ubicación" : "Guardar Ubicación"}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
};