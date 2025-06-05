import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            // Aquí harías la petición real al backend
            // const response = await api.post('/auth/login', data);

            // Simulación de respuesta del backend
            const mockUser = {
                id: '123',
                name: 'Usuario Ejemplo',
                email: data.email,
                token: 'mock-token',
            };

            login(mockUser); // Guarda el usuario en el contexto
            navigate('/admin/dashboard'); // Redirige al dashboard
        } catch (error) {
            console.error('Error en el login:', error);
            // Aquí puedes manejar errores, por ejemplo mostrando un toast
        } finally {
            setIsLoading(false);
        }
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

                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

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