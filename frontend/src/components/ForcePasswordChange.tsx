import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import api from "../api";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_TEMP_PASSWORD } from "../utils/passwordGenerator";

const passwordChangeSchema = z.object({
    newPassword: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "La contraseña debe contener al menos una minúscula, una mayúscula, un número y un carácter especial"
        ),
    confirmPassword: z.string().min(1, "La confirmación de la contraseña es obligatoria"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== DEFAULT_TEMP_PASSWORD, {
    message: "La nueva contraseña no puede ser igual a la contraseña temporal",
    path: ["newPassword"],
});

type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

interface ForcePasswordChangeProps {
    onPasswordChanged: () => void;
}

const ForcePasswordChange = ({ onPasswordChanged }: ForcePasswordChangeProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false,
    });
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<PasswordChangeValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: PasswordChangeValues) => {
        setIsLoading(true);
        try {
            // Llamar al endpoint de cambio de contraseña
            await api.post('accounts/auth/change-password/', {
                new_password: data.newPassword,
            });

            toast.success("¡Contraseña cambiada exitosamente! Por favor, inicia sesión con tu nueva contraseña.");

            // Cerrar sesión para que el usuario inicie sesión con la nueva contraseña
            logout();
            setTimeout(() => {
                navigate('/login', { replace: true });
                window.location.reload();
            }, 1500); // Espera 1.5 segundos para mostrar el toast
        } catch (error: any) {
            console.error('Error changing password:', error);

            let errorMessage = 'Error al cambiar la contraseña';
            if (error.response?.data?.new_password) {
                errorMessage = error.response.data.new_password[0];
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="text-green-500 text-5xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-green-800 mb-2">
                        Cambio de contraseña requerido
                    </h1>
                    <p className="text-green-600 text-sm">
                        Debes cambiar tu contraseña temporal antes de continuar.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                        <p className="text-xs text-yellow-700">
                            <strong>Contraseña temporal actual:</strong> {DEFAULT_TEMP_PASSWORD}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nueva contraseña */}
                    <div>
                        <label className="block text-green-700 mb-2 font-medium text-sm">
                            Nueva contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                {...register("newPassword")}
                                className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.newPassword ? "border-red-500" : "border-green-300"
                                }`}
                                placeholder="Ingresa la nueva contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
                            >
                                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
                        )}
                        <div className="text-xs text-green-600 mt-1">
                            Debe contener: 8+ caracteres, mayúscula, minúscula, número y carácter especial
                        </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                        <label className="block text-green-700 mb-2 font-medium text-sm">
                            Confirmar nueva contraseña *
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.confirmPassword ? "border-red-500" : "border-green-300"
                                }`}
                                placeholder="Confirma la nueva contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
                            >
                                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
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
                                    Actualizando contraseña...
                                </>
                            ) : (
                                "Cambiar contraseña"
                            )}
                        </button>
                    </div>
                </form>

                {/* Eliminado el botón de regreso manual al login, ahora la redirección es automática tras el cambio de contraseña */}
            </div>
        </div>
    );
};

export default ForcePasswordChange;
