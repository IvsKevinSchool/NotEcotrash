import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';
import api from '../api'; // Asegúrate de importar tu configuración de axios
import logo from '../assets/Logo.png';
import ForcePasswordChange from '../components/ForcePasswordChange';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showForcePasswordChange, setShowForcePasswordChange] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async (data) => {
        setIsLoading(true);
        try {
            console.log('🔍 Datos de login enviados:', data);
            const response = await api.post('accounts/auth/login/', data);
            console.log('🔍 Respuesta completa del servidor:', response);
            console.log('🔍 Status de respuesta:', response.status);
            console.log('🔍 Data de respuesta:', response.data);

            // 2. Verificar si la respuesta fue exitosa
            if (response.status >= 200 && response.status < 300) {
                const userData = {
                    id: response.data.data.management.pk_management, // Accede a través de data.user
                    // id: response.data.data.user.pk, // Accede a través de data.user
                    username: response.data.data.user.username,
                    name: response.data.data.user.full_name, // Usa full_name en lugar de combinar first y last
                    email: response.data.data.user.email,
                    token: response.data.data.access_token, // access_token en lugar de access
                    //refreshToken: response.data.data.refresh_token, // refresh_token en lugar de refresh
                    role: response.data.data.user.role,
                    is_first_login: response.data.data.user.is_first_login || false, // Campo para primer login
                    //id_management: response.data.data.management.pk_management || 0, // Asegúrate de que este campo exista
                };

                console.log('🔍 Datos del usuario procesados:', userData);
                console.log('🔍 Rol específico:', userData.role, typeof userData.role);
                console.log('🔍 Primer login:', userData.is_first_login);

                // 3. Verificar si es primer login
                if (userData.is_first_login) {
                    console.log('🔍 Es primer login, mostrando cambio de contraseña');
                    // Guardar usuario en el contexto pero mostrar cambio de contraseña
                    login(userData);
                    setShowForcePasswordChange(true);
                    return;
                }

                console.log('🔍 No es primer login, procediendo con login normal');

                // 4. Guardar usuario en el contexto de autenticación (login normal)
                login(userData);

                // 5. Mostrar mensaje de bienvenida
                toast.success(`Bienvenido ${userData.name}`);

                // 6. Redireccionar según el rol
                const from = location.state?.from?.pathname || getDashboardPath(userData.role);
                console.log('🔍 Redirigiendo a:', from);
                navigate(from, { replace: true });
            } else {
                throw new Error(response.data?.message || 'Error en el login');
            }
        } catch (error) {
            console.error('Error en el login:', error);

            // 6. Manejo de errores específicos
            let errorMessage = 'Error al iniciar sesión';

            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'Credenciales inválidas';
                } else if (error.response.status === 403) {
                    errorMessage = 'Cuenta no verificada o sin permisos';
                } else {
                    errorMessage = error.response.data?.detail ||
                        error.response.data?.message ||
                        `Error ${error.response.status}`;
                }
            } else if (error.request) {
                errorMessage = 'No se pudo conectar con el servidor';
            }

            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar cuando se cambia la contraseña exitosamente
    const handlePasswordChanged = () => {
        setShowForcePasswordChange(false);
        // El usuario será deslogueado automáticamente en ForcePasswordChange
    };

    // Función para determinar la ruta según el rol
    const getDashboardPath = (role) => {
        console.log('Rol del usuario:', role);
        switch (role) {
            case 'admin':
                return '/admin/dashboard';
            case 'management':
                return '/management/';
            case 'collector':
                return '/collector/routes';
            case 'client':
                return '/client/requests';
            default:
                return '/dashboard';
        }
    };

    // Si necesita cambiar contraseña, mostrar el componente correspondiente
    if (showForcePasswordChange) {
        return <ForcePasswordChange onPasswordChanged={handlePasswordChanged} />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sección izquierda - Formulario */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md">
                    <div
                        className="flex items-center mb-8 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
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
                        <Link
                            to="/register"
                            className="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                        >
                            Regístrate ahora
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sección derecha - Imagen */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-8">
                <div className="text-center p-4 md:p-8">
                    <img
                        src={logo}
                        alt="Logo EcoTrash"
                        className="mx-auto h-32 md:h-48 w-auto mb-6"
                    />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">EcoTrash</h2>
                    <p className="text-lg md:text-xl text-green-100">Transformando residuos en recursos</p>

                    <div className="mt-8 flex justify-center space-x-4">
                        {['♻️', '🌱', '🌍'].map((emoji, index) => (
                            <div
                                key={index}
                                className="bg-green-400 bg-opacity-30 p-3 rounded-full hover:bg-opacity-50 transition-all duration-300"
                            >
                                <span className="text-white text-xl">{emoji}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;