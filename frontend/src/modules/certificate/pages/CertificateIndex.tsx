import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { CertificateFormData, certificateSchema } from "../schemas/certificateSchemas";
import { createCertificate, getClients } from "../services/certificateService";
import { useAuth } from "../../../context/AuthContext";

const CertificateIndex = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [clients, setClients] = useState<Array<{ pk_client: number, name: string, email: string }>>([]);
    const { user } = useAuth();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CertificateFormData>({
        resolver: zodResolver(certificateSchema)
    });

    const selectedFile = watch("pdf");
    const selectedClientId = watch("fk_client");

    // Obtener lista de clientes
    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const data = await getClients(user.id || 0);
                setClients(data);
            } catch (error) {
                toast.error("Error al cargar los clientes");
                console.error("Error fetching clients:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    const onSubmit = async (data: CertificateFormData) => {
        try {
            await createCertificate(data);
            toast.success("Certificado registrado exitosamente");
            resetForm();
        } catch (error) {
            console.error("Error al registrar certificado:", error);
            toast.error("Error al registrar certificado");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setValue("pdf", e.target.files[0]);
        }
    };

    const resetForm = () => {
        reset({
            fk_client: selectedClientId,
            certificate_name: "",
            pdf: undefined
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Registrar Nuevo Certificado</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {/* Selector de Cliente */}
                    <div>
                        <label className="block text-green-700 mb-1">Cliente *</label>
                        <select
                            {...register("fk_client", { valueAsNumber: true })}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.fk_client ? "border-red-500" : "border-green-300"
                                }`}
                            disabled={isLoading}
                        >
                            <option value="">Seleccione un cliente...</option>
                            {clients.map((client) => (
                                <option key={client.pk_client} value={client.pk_client}>
                                    {client.name} - {client.email}
                                </option>
                            ))}
                        </select>
                        {errors.fk_client && (
                            <p className="text-red-500 text-sm mt-1">{errors.fk_client.message}</p>
                        )}
                    </div>

                    {/* Nombre del Certificado */}
                    <div>
                        <label className="block text-green-700 mb-1">Nombre del Certificado *</label>
                        <input
                            type="text"
                            {...register("certificate_name")}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.certificate_name ? "border-red-500" : "border-green-300"
                                }`}
                            placeholder="Ej: Certificado de Disposición Final"
                            disabled={isLoading}
                        />
                        {errors.certificate_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.certificate_name.message}</p>
                        )}
                    </div>

                    {/* Selector de Archivo PDF */}
                    <div>
                        <label className="block text-green-700 mb-1">Documento PDF *</label>
                        <div className="flex items-center gap-2">
                            <label className={`flex flex-col items-center px-4 py-2 rounded-lg border cursor-pointer hover:bg-green-50 ${errors.pdf ? "border-red-500" : "border-green-300"
                                }`}>
                                <span className="text-sm text-green-700">
                                    {selectedFile?.name || "Seleccionar archivo PDF"}
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={isLoading}
                                />
                            </label>
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={() => setValue("pdf", undefined, { shouldValidate: true })}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={isLoading}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                        {errors.pdf && (
                            <p className="text-red-500 text-sm mt-1">{errors.pdf.message}</p>
                        )}
                        {!selectedFile && (
                            <p className="text-sm text-gray-500 mt-1">Formatos aceptados: .pdf</p>
                        )}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-green-400 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registrando...
                            </>
                        ) : "Registrar Certificado"}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        disabled={isSubmitting || isLoading}
                    >
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CertificateIndex;