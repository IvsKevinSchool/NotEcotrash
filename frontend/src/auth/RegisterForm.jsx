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
            {/* Sección de Información Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre de Usuario */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Nombre de Usuario*
                    </label>
                    <input
                        type="text"
                        id="username"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="juan123"
                        {...register('username', {
                            required: 'El nombre de usuario es requerido',
                            minLength: {
                                value: 4,
                                message: 'Debe tener al menos 4 caracteres',
                            },
                        })}
                    />
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                {/* Correo Electrónico */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico*
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
                    <p className="mt-1 text-xs text-gray-500">Usado para iniciar sesión</p>
                </div>

                {/* Nombre */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        Nombre(s)*
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="Juan"
                        {...register('first_name', {
                            required: 'El nombre es requerido',
                            minLength: {
                                value: 2,
                                message: 'Debe tener al menos 2 caracteres',
                            },
                        })}
                    />
                    {errors.first_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                </div>

                {/* Apellido */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Apellido(s)*
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="Pérez"
                        {...register('last_name', {
                            required: 'El apellido es requerido',
                            minLength: {
                                value: 2,
                                message: 'Debe tener al menos 2 caracteres',
                            },
                        })}
                    />
                    {errors.last_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                </div>
            </div>

            {/* Sección de Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Contraseña*
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
                                message: 'Debe tener al menos 8 caracteres',
                            },
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                                message: 'Debe contener mayúsculas, minúsculas y números'
                            }
                        })}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres con mayúsculas, minúsculas y números</p>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                    <label htmlFor="password2" className="block text-sm font-medium text-gray-700">
                        Confirmar contraseña*
                    </label>
                    <input
                        type="password"
                        id="password2"
                        className={`mt-1 block w-full px-4 py-2 border ${errors.password2 ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        placeholder="••••••••"
                        {...register('password2', {
                            required: 'Debes confirmar tu contraseña',
                            validate: value =>
                                value === password || 'Las contraseñas no coinciden',
                        })}
                    />
                    {errors.password2 && (
                        <p className="mt-1 text-sm text-red-600">{errors.password2.message}</p>
                    )}
                </div>
            </div>

            {/* Botón de Registro */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registrando...
                        </>
                    ) : 'Registrarse'}
                </button>
            </div>

            {/* Enlace a Login */}
            <div className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta? {' '}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                    Inicia sesión
                </Link>
            </div>
        </form>
    );
};

export default RegisterForm;