import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto">
        {/* Ilustración/icono */}
        <div className="mb-8 text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        {/* Texto */}
        <h1 className="text-5xl font-bold text-green-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        
        {/* Botón */}
        <Link 
          to="/admin/dashboard" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Volver al inicio
        </Link>
        
        {/* Enlace adicional */}
        <div className="mt-6">
          <Link 
            to="/contacto" 
            className="text-sm font-medium text-green-600 hover:text-green-500"
          >
            ¿Necesitas ayuda? Contáctanos →
          </Link>
        </div>
      </div>
    </div>
  );
}