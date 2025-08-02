import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ManagementService } from "../../management/services/managementService";
import { handleApiError } from "../../../components/handleApiError";
import { managementFormSchema, ManagementFormValues } from "../schemas/userSchema";



const ManagementRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ManagementFormValues>({
        resolver: zodResolver(managementFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone_number: "",
            phone_number_2: "",
            rfc: "",
        },
    });

    const onSubmit = async (data: ManagementFormValues) => {
        setIsLoading(true);
        try {
            // Preparar los datos para el registro
            const registrationData = {
                name: data.name,
                email: data.email,
                username: data.email.split('@')[0], // Generar username del email
                first_name: data.name.split(' ')[0] || data.name,
                last_name: data.name.split(' ')[1] || ".",
                role: "management",
                password: "TempPass123", // Contraseña temporal
                password2: "TempPass123",
                phone_number: data.phone_number,
                phone_number_2: data.phone_number_2,
                rfc: data.rfc,
            };

            // Llamar al servicio de registro
            await ManagementService.register(registrationData);

            toast.success("Management registered successfully!");
            setSuccess(true);
            reset();

            // Opcional: redirigir después de éxito
            // navigate('/managements');
        } catch (error) {
            handleApiError(error, "Error registering management");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
                    <div className="text-green-500 text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">Registration Successful!</h2>
                    <p className="text-green-600 mb-6">
                        The management company has been registered successfully.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Register Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
                <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
                    Register New Management Company
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div>
                            <label className="block text-green-700 mb-2 font-medium">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                {...register("name")}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.name ? "border-red-500" : "border-green-300"
                                    }`}
                                placeholder="Enter company name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-green-700 mb-2 font-medium">
                                Email *
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? "border-red-500" : "border-green-300"
                                    }`}
                                placeholder="Enter company email"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* RFC */}
                        <div>
                            <label className="block text-green-700 mb-2 font-medium">
                                RFC *
                            </label>
                            <input
                                type="text"
                                {...register("rfc")}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.rfc ? "border-red-500" : "border-green-300"
                                    }`}
                                placeholder="Enter RFC (12-13 characters)"
                                maxLength={13}
                            />
                            {errors.rfc && (
                                <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-green-700 mb-2 font-medium">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                {...register("phone_number")}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.phone_number ? "border-red-500" : "border-green-300"
                                    }`}
                                placeholder="Enter primary phone number"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone_number.message}
                                </p>
                            )}
                        </div>

                        {/* Secondary Phone Number (Opcional) */}
                        <div className="md:col-span-2">
                            <label className="block text-green-700 mb-2 font-medium">
                                Secondary Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                {...register("phone_number_2")}
                                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                placeholder="Enter secondary phone number"
                            />
                            {errors.phone_number_2 && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone_number_2.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Register Management Company"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagementRegister;