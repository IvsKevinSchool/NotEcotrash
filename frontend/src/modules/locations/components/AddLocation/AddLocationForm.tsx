import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon, UserIcon } from "@heroicons/react/24/outline";
import { FormInput } from "./FormInput";
import { FormSection } from "./FormSection";
import api from "../../../../api";
import { clientLocationSchema, ClientLocationFormData, transformLocationData } from "../../schemas";
import { useAuth } from "../../../../context/AuthContext";
import { handleApiError } from "../../../../components/handleApiError";
import { Client } from "../../types";

export const AddLocationForm = () => {
    const { pk } = useParams();
    const id = Number(pk);
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [clients, setClients] = useState<Client[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(true);

    const methods = useForm<ClientLocationFormData>({
        resolver: zodResolver(clientLocationSchema),
        defaultValues: {
            fk_client: 0,
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
        formState: { isSubmitting, errors: formErrors },
        reset,
        setError,
        register
    } = methods;

    // Verificar si hay errores en el formulario
    const hasErrors = Object.keys(formErrors).length > 0;

    // Cargar lista de clientes
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setIsLoadingClients(true);
                const response = await api.get(`client/by-management/${user.id}/`);
                setClients(response.data);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
                toast.error("Error al cargar la lista de clientes");
            } finally {
                setIsLoadingClients(false);
            }
        };

        fetchClients();
    }, [user.id]);

    // Cargar datos si estamos editando
    useEffect(() => {
        if (isEditing) {
            const fetchLocationData = async () => {
                try {
                    // Necesitamos obtener los datos de ClientsLocations, no ManagementLocations
                    const response = await api.get(`client/locations/${id}/`);
                    const data = {
                        fk_client: response.data.fk_client || 0,
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
    }, [id, isEditing, reset, navigate]);

    const onSubmit: SubmitHandler<ClientLocationFormData> = async (data) => {
        try {
            console.log("Datos validados:", data);

            // Procesar los datos para el backend
            const processedData = {
                ...data,
                fk_location: {
                    ...data.fk_location,
                    interior_number: data.fk_location.interior_number === "" ? null : data.fk_location.interior_number,
                    postcode: data.fk_location.postcode === "" ? null : data.fk_location.postcode,
                }
            };

            if (isEditing) {
                await api.patch(`client/${processedData.fk_client}/locations/${id}/`, processedData);
                toast.success("Ubicación actualizada exitosamente");
            } else {
                await api.post(`client/${processedData.fk_client}/locations/`, processedData);
                toast.success("Ubicación creada exitosamente");
            }

            setTimeout(() => navigate("/management/locations"), 1000);
        } catch (error: any) {
            console.error(error);
            
            // Manejar errores de validación del backend
            if (error.response?.status === 400 && error.response?.data) {
                const backendErrors = error.response.data;
                
                // Mapear errores del backend a los campos del formulario
                Object.keys(backendErrors).forEach((field) => {
                    const errorMessage = Array.isArray(backendErrors[field]) 
                        ? backendErrors[field][0] 
                        : backendErrors[field];
                    
                    if (field === 'fk_client') {
                        setError('fk_client', { message: errorMessage });
                    } else if (field.startsWith('fk_location.')) {
                        setError(field as any, { message: errorMessage });
                    } else if (field === 'is_main') {
                        setError('is_main', { message: errorMessage });
                    } else {
                        // Para errores de campos de ubicación sin el prefijo fk_location
                        const locationField = `fk_location.${field}` as any;
                        setError(locationField, { message: errorMessage });
                    }
                });
                
                toast.error('Por favor corrige los errores en el formulario');
            } else {
                handleApiError(error, `Error al ${isEditing ? 'actualizar' : 'crear'} ubicación:`);
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-green-50 p-6 rounded-lg shadow space-y-6">
                <h1 className="text-2xl font-bold text-green-800">
                    {isEditing ? 'Editar Ubicación' : 'Agregar Nueva Ubicación'}
                </h1>

                {/* Sección Selección de Cliente */}
                <FormSection
                    title="Seleccionar Cliente"
                    icon={UserIcon}
                >
                    <div>
                        <label className="block text-green-700 mb-2 font-medium">
                            Cliente *
                        </label>
                        {isLoadingClients ? (
                            <div className="w-full p-2 border border-green-300 rounded bg-gray-50 text-gray-500">
                                Cargando clientes...
                            </div>
                        ) : (
                            <select
                                {...register("fk_client", { 
                                    valueAsNumber: true,
                                    required: "Debe seleccionar un cliente"
                                })}
                                className={`w-full p-2 border ${
                                    methods.formState.errors.fk_client 
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                                        : "border-green-300 focus:ring-green-500 focus:border-green-500"
                                } rounded focus:ring-2`}
                                aria-invalid={methods.formState.errors.fk_client ? "true" : "false"}
                            >
                                <option value={0}>Seleccionar Cliente</option>
                                {clients.map((client) => (
                                    <option key={client.pk_client} value={client.pk_client}>
                                        {client.name} - {client.legal_name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {methods.formState.errors.fk_client && (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                                {methods.formState.errors.fk_client.message}
                            </p>
                        )}
                    </div>
                </FormSection>

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
                        inputMode="text"
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

                {/* Mensaje de error general */}
                {hasErrors && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Hay errores en el formulario
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>Por favor revisa y corrige los campos marcados en rojo.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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