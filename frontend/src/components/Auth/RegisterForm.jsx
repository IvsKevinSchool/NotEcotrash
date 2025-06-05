import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");

    return (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="Juan"
                        {...register('firstName', {
                            required: 'El nombre es requerido',
                            minLength: {
                                value: 2,
                                message: 'El nombre debe tener al menos 2 caracteres',
                            },
                        })}
                    />
                    {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Apellido
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="Pérez"
                        {...register('lastName', {
                            required: 'El apellido es requerido',
                            minLength: {
                                value: 2,
                                message: 'El apellido debe tener al menos 2 caracteres',
                            },
                        })}
                    />
                    {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                    placeholder="tu@email.com"
                    {...register('email', {
                        required: 'El correo electrónico es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido',
                        },
                    })}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                    {...register('password', {
                        required: 'La contraseña es requerida',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                        },
                    })}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    className={`mt-1 block w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                        required: 'Debes confirmar tu contraseña',
                        validate: value =>
                            value === password || 'Las contraseñas no coinciden',
                    })}
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
            </div>

            <div className="flex items-center">
                <input
                    id="terms"
                    type="checkbox"
                    className={`h-4 w-4 ${errors.terms ? 'text-red-600' : 'text-green-600'
                        } focus:ring-green-500 border-gray-300 rounded`}
                    {...register('terms', {
                        required: 'Debes aceptar los términos y condiciones',
                    })}
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    Acepto los <Link to="/terms" className="text-green-600 hover:text-green-500">términos y condiciones</Link>
                </label>
            </div>
            {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms.message}</p>
            )}

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;