import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../api'
import { handleApiError } from '../components/handleApiError';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    console.log('Datos de registro:', data);
    setIsLoading(true);

    try {
      // 1. Hacer la petición al backend
      const response = await api.post('accounts/auth/register/', data);

      // 2. Verificar si la respuesta fue exitosa (código 2xx)
      if (response.status >= 200 && response.status < 300) {

        // 5. Mostrar feedback al usuario
        toast.success('Sign up successfully!');

        navigate('/login');
      } else {
        // Manejar respuestas no exitosas (ej. 400, 500)
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      handleApiError(error, 'Error al registrarse');
    } finally {
      // 8. Restablecer el estado de carga
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600 mb-8">Únete a nuestra comunidad ecológica</p>

          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />

        </div>
      </div>

      {/* Sección derecha - Imagen */}
      <div className="w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
        <div className="text-center p-8">
          <img
            src={logo}
            alt="Logo EcoTrash"
            className="mx-auto h-48 w-auto mb-6"
          />
          <h2 className="text-4xl font-bold text-white mb-4">NotEcoTrash</h2>
          <p className="text-xl text-green-100">Juntos por un planeta más limpio</p>

          <div className="mt-8">
            <div className="inline-flex space-x-2 bg-green-800 bg-opacity-50 px-6 py-3 rounded-full">
              <span className="text-white">♻️</span>
              <p className="text-green-100">Regístrate y obtén 100 puntos ecológicos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;