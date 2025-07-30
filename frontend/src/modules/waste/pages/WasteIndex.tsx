import React from 'react';
import { Link } from 'react-router-dom';
import { TrashIcon, TagIcon } from '@heroicons/react/24/outline';

const WasteIndex = () => {
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Gestión de Residuos</h1>
          <p className="text-green-600">Administra tipos de residuos y sus subcategorías</p>
        </div>

        {/* Módulos disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subcategorías de Residuos */}
          <Link
            to="/waste/subcategories"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TagIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Subcategorías de Residuos</h3>
                <p className="text-gray-600 mt-1">Gestiona las subcategorías de tipos de residuos</p>
              </div>
            </div>
          </Link>

          {/* Placeholder para otros módulos futuros */}
          <div className="bg-gray-100 rounded-lg shadow-md p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-200 p-3 rounded-lg">
                <TrashIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-400">Tipos de Residuos</h3>
                <p className="text-gray-400 mt-1">Próximamente...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteIndex;
