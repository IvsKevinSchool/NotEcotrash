import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import LoginForm from './LoginForm';
import { toast } from 'react-toastify';
import api from '../api'; // Asegúrate de importar tu configuración de axios
import logo from '../assets/logo-zerura.png';
import ForcePasswordChange from '../components/ForcePasswordChange';
import { FaRecycle, FaGlobeAmericas } from 'react-icons/fa';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForcePasswordChange, setShowForcePasswordChange] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      const response = await api.post('accounts/auth/login/', data);

      if (response.status >= 200 && response.status < 300) {
        const userData = {
          id:
            response.data.data.management?.pk_management ||
            response.data.data.client?.pk_client ||
            response.data.data.collector?.pk_collector_user ||
            response.data.data.user.pk,
          username: response.data.data.user.username,
          name: response.data.data.user.full_name,
          email: response.data.data.user.email,
          token: response.data.data.access_token,
          role: response.data.data.user.role,
          id_admin: response.data.data.user.pk || 0,
          is_first_login: response.data.data.user.is_first_login || false,
          // Información específica del rol
          management: response.data.data.management || null,
          client: response.data.data.client || null,
          collector: response.data.data.collector || null,
        };

        if (userData.is_first_login) {
          login(userData);
          setShowForcePasswordChange(true);
          return;
        }

        login(userData);
        toast.success(`Bienvenido ${userData.name}`);

        const from =
          location.state?.from?.pathname || getDashboardPath(userData.role);
        navigate(from, { replace: true });
      } else {
        throw new Error(response.data?.message || 'Error en el login');
      }
    } catch (error) {
      let errorMessage = 'Error al iniciar sesión';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.response.status === 403) {
          errorMessage = 'Cuenta no verificada o sin permisos';
        } else {
          errorMessage =
            error.response.data?.detail ||
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

  const handlePasswordChanged = () => {
    setShowForcePasswordChange(false);
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'management':
        return '/management/dashboard';
      case 'collector':
        return '/collector/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/dashboard';
    }
  };

  if (showForcePasswordChange) {
    return <ForcePasswordChange onPasswordChanged={handlePasswordChanged} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-green-100 overflow-hidden relative">
      {/* Fondo animado de burbujas */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute bg-green-300 rounded-full opacity-20 animate-bubble"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Sección izquierda - Formulario */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full max-w-md transform transition-transform duration-700 ease-in-out hover:scale-[1.03] shadow-lg rounded-3xl p-8 bg-white/90 backdrop-blur-sm border border-green-200">
          <div
            className="flex items-center mb-8 cursor-pointer group select-none"
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

            <span className="text-3xl font-extrabold text-green-600 group-hover:text-green-800 transition-colors duration-200 tracking-wide select-text">
              Zeru
            </span>
            <span className="text-3xl font-extrabold text-gray-800 group-hover:text-gray-900 transition-colors duration-200 tracking-wide select-text">
              ra
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight animate-fadeInDown">
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-600 mb-10 animate-fadeInDown animate-delay-150">
            Ingresa para gestionar tus residuos
          </p>

          {/* Formulario con animación de aparición */}
          <div className="animate-fadeInUp">
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Sección derecha - Imagen y contenido animado */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-8 relative overflow-hidden">
        <div className="text-center p-6 md:p-12 max-w-lg text-white relative z-10">
          <img
            src={logo}
            alt="Logo EcoTrash"
            className="mx-auto h-32 md:h-48 w-auto animate-bounce-slow"
          />
          <p className="text-lg md:text-xl text-green-100 font-semibold animate-fadeInSlow">
            Transformando residuos en recursos
          </p>

          <div className="mt-10 flex justify-center space-x-6">
            {[
              { icon: FaRecycle, key: 'recycle' },
              { icon: FaGlobeAmericas, key: 'world' }
            ].map(({ icon: Icon, key }, index) => (
              <div
                key={key}
                className="bg-green-700 bg-opacity-30 p-4 rounded-full hover:bg-opacity-60 transition-all duration-500 transform shadow-lg"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Icon className="text-white text-3xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Overlay animado de hojas moviéndose */}
        <svg
          className="absolute top-10 right-10 w-32 h-32 opacity-20 animate-spin-slow"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2a10 10 0 0110 10 10 10 0 01-10 10 10 10 0 010-20z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2"
          />
        </svg>
      </div>

      {/* Estilos y animaciones integradas */}
      <style>{`
        @keyframes bubble {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.15;
            transform: translateY(-20px) translateX(15px) scale(1.1);
          }
          100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
        }
        .animate-bubble {
          animation-name: bubble;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease forwards;
        }
        .animate-delay-150 {
          animation-delay: 0.15s;
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease forwards;
        }

        @keyframes fadeInSlow {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.5s ease forwards;
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15%);
          }
        }
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }

        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
