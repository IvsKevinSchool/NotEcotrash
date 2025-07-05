import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                            value: 6,
                            message: 'La contraseña debe tener al menos 6 caracteres',
                        },
                    })}
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        {...register('rememberMe')}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Recordarme
                    </label>
                </div>

                <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;