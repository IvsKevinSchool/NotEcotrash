import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { wasteSubcategorySchema, WasteSubcategoryFormData } from '../schemas/wasteSubcategorySchema';
import { Waste } from '../services/wasteSubcategoryService';

interface WasteSubcategoryFormInitialData {
  name?: string;
  description: string;
  fk_waste: number;
  is_active: boolean;
}

interface WasteSubcategoryFormProps {
  wastes: Waste[];
  onSubmit: (data: WasteSubcategoryFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  initialData?: WasteSubcategoryFormInitialData;
  defaultWasteId?: number | null;
}

const WasteSubcategoryForm: React.FC<WasteSubcategoryFormProps> = ({
  wastes,
  onSubmit,
  onCancel,
  isEditing = false,
  initialData,
  defaultWasteId
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<WasteSubcategoryFormData>({
    resolver: zodResolver(wasteSubcategorySchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      fk_waste: defaultWasteId || 0,
      is_active: true,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800">
          {isEditing ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Campo de Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Subcategoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register('name')}
              className={`block w-full px-3 py-2 border ${
                errors.name 
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2`}
              placeholder="Ej: Botellas PET, Bolsas de plástico, etc."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Campo de Residuo */}
          <div>
            <label htmlFor="fk_waste" className="block text-sm font-medium text-gray-700 mb-2">
              Residuo <span className="text-red-500">*</span>
            </label>
            <select
              id="fk_waste"
              {...register('fk_waste', { valueAsNumber: true })}
              className={`block w-full px-3 py-2 border ${
                errors.fk_waste 
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                  : "border-gray-300 focus:ring-green-500 focus:border-green-500"
              } rounded-lg shadow-sm focus:outline-none focus:ring-2`}
            >
              <option value={0}>Seleccione un residuo</option>
              {wastes.map((waste) => (
                <option key={waste.pk_waste} value={waste.pk_waste}>
                  {waste.name}
                </option>
              ))}
            </select>
            {errors.fk_waste && (
              <p className="mt-1 text-sm text-red-600">{errors.fk_waste.message}</p>
            )}
          </div>
        </div>

        {/* Campo de Descripción - Ancho completo */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción Detallada <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className={`block w-full px-3 py-2 border ${
              errors.description 
                ? "border-red-300 focus:ring-red-500 focus:border-red-500" 
                : "border-gray-300 focus:ring-green-500 focus:border-green-500"
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 resize-none`}
            placeholder="Descripción más detallada de la subcategoría"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Campo de Estado Activo */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('is_active')}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Subcategoría activa</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 sm:pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white order-1 sm:order-2 ${
              isSubmitting || !isValid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            }`}
          >
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WasteSubcategoryForm;