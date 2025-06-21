import { Link, useNavigate } from 'react-router-dom';
import { } from '../assets/icons';

const Register = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda - Formulario */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div
            className="flex items-center mb-8 cursor-pointer group"
            onClick={() => navigate('/login')}
          >
            {/* Flecha de regreso con animación */}
            <BackRowIcon />

            <span className="text-3xl font-bold text-green-600 group-hover:text-green-800 transition-colors duration-200">Eco</span>
            <span className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">Trash</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crea tu cuenta</h1>
          <p className="text-gray-600 mb-8">Únete a nuestra comunidad ecológica</p>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Juan"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Pérez"
                />
              </div>
            </div>

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
              <p className="mt-1 text-xs text-gray-500">Mínimo 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirm-password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Acepto los <Link to="/terms" className="text-green-600 hover:text-green-500">términos y condiciones</Link>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
              >
                Registrarse
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Inicia sesión
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