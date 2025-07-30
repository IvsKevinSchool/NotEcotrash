import React from 'react';
import { WasteSubcategory } from '../services/wasteSubcategoryService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface WasteSubcategoryTableProps {
  subcategories: WasteSubcategory[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const WasteSubcategoryTable: React.FC<WasteSubcategoryTableProps> = ({
  subcategories, onEdit, onDelete, isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6a2 2 0 00-2 2v3a2 2 0 01-2 2v-3a2 2 0 00-2-2H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay subcategorías registradas</h3>
        <p className="text-gray-500">Comienza agregando una nueva subcategoría de residuo</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider w-16">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider min-w-48">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider min-w-60">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider min-w-40">
                Residuo Principal
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider w-24">
                Estado
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider w-32">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subcategories.map((subcategory) => (
              <tr key={subcategory.pk_waste_subcategory} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subcategory.pk_waste_subcategory}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 break-words">
                    {subcategory.name || subcategory.description?.split(' ').slice(0, 4).join(' ') || 'Sin nombre'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 break-words max-w-xs">
                    {subcategory.description}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {typeof subcategory.fk_waste === 'object' && subcategory.fk_waste?.name 
                      ? subcategory.fk_waste.name 
                      : `Residuo #${typeof subcategory.fk_waste === 'number' ? subcategory.fk_waste : subcategory.fk_waste?.pk_waste}`}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    subcategory.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subcategory.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEdit(subcategory.pk_waste_subcategory)}
                      className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors"
                      title="Editar subcategoría"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(subcategory.pk_waste_subcategory)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                      title="Eliminar subcategoría"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer con información adicional */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Total de subcategorías: <span className="font-medium">{subcategories.length}</span>
        </p>
      </div>
    </div>
  );
};

export default WasteSubcategoryTable;
