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
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
}).refine((data) => data.newPassword !== DEFAULT_TEMP_PASSWORD, {
    message: "New password cannot be the same as the temporary password",
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

            toast.success("Password changed successfully! Please log in with your new password.");
            
            // Cerrar sesión para que el usuario inicie sesión con la nueva contraseña
            logout();
            navigate('/login');
            
        } catch (error: any) {
            console.error('Error changing password:', error);
            
            let errorMessage = 'Error changing password';
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
                        Password Change Required
                    </h1>
                    <p className="text-green-600 text-sm">
                        You must change your temporary password before continuing.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                        <p className="text-xs text-yellow-700">
                            <strong>Current temporary password:</strong> {DEFAULT_TEMP_PASSWORD}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label className="block text-green-700 mb-2 font-medium text-sm">
                            New Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                {...register("newPassword")}
                                className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.newPassword ? "border-red-500" : "border-green-300"
                                }`}
                                placeholder="Enter new password"
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
                            Must contain: 8+ characters, uppercase, lowercase, number, and special character
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-green-700 mb-2 font-medium text-sm">
                            Confirm New Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                {...register("confirmPassword")}
                                className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                                    errors.confirmPassword ? "border-red-500" : "border-green-300"
                                }`}
                                placeholder="Confirm new password"
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
                                    Updating Password...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login', { replace: true });
                            window.location.reload();
                        }}
                        className="text-sm text-green-600 hover:text-green-700 underline"
                    >
                        Logout and return to login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForcePasswordChange;
