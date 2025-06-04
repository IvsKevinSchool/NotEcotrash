import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simular login exitoso
        const mockUser = {
            id: '123',
            name: 'Usuario Ejemplo',
            email: email,
            token: 'mock-token'
        };

        login(mockUser); // Guarda el usuario en el contexto
        navigate('/admin/dashboard'); // Redirige al dashboard
    };

    return (
        <div className="min-h-screen flex">
            {/* Sección izquierda - Formulario */}
            <div className="w-1/2 bg-white flex items-center justify-center p-12">
                <div className="w-full max-w-md">
                    <div
                        className="flex items-center mb-8 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        {/* Flecha de regreso con animación */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2 text-green-600 group-hover:text-green-800 transition-colors duration-200 transform group-hover:-translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>

                        <span className="text-3xl font-bold text-green-600 group-hover:text-green-800 transition-colors duration-200">Eco</span>
                        <span className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">Trash</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de vuelta</h1>
                    <p className="text-gray-600 mb-8">Ingresa para gestionar tus residuos</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
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
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/auth/register" className="font-medium text-green-600 hover:text-green-500">
                            Regístrate ahora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sección derecha - Imagen */}
            <div className="w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                <div className="text-center p-8">
                    <img
                        src="/logo.png"
                        alt="Logo EcoTrash"
                        className="mx-auto h-48 w-auto mb-6"
                    />
                    <h2 className="text-4xl font-bold text-white mb-4">NotEcoTrash</h2>
                    <p className="text-xl text-green-100">Transformando residuos en recursos</p>

                    <div className="mt-8 flex justify-center space-x-4">
                        <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-white">♻️</span>
                        </div>
                        <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-white">🌱</span>
                        </div>
                        <div className="bg-green-400 bg-opacity-30 p-3 rounded-full">
                            <span className="text-white">🌍</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;