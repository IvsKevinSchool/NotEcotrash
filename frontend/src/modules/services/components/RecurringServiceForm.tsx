import React, { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecurringServiceFormData, recurringServiceSchema } from '../schemas/recurringServiceSchema';
import { FREQUENCY_OPTIONS } from '../types/recurringService';
import { Client, Location, TypeService, Waste, WasteSubcategory } from '../api/serviceFormServices';

interface RecurringServiceFormProps {
  onSubmit: (data: RecurringServiceFormData) => void;
  onCancel: () => void;
  initialData?: Partial<RecurringServiceFormData>;
  clients: Client[];
  locations: Location[];
  typeServices: TypeService[];
  wastes: Waste[];
  wasteSubcategories: WasteSubcategory[];
  isLoading?: boolean;
  isEditing?: boolean;
}

const RecurringServiceForm: React.FC<RecurringServiceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  clients,
  locations,
  typeServices,
  wastes,
  wasteSubcategories,
  isLoading = false,
  isEditing = false,
}) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<RecurringServiceFormData>({
    resolver: zodResolver(recurringServiceSchema),
    defaultValues: initialData,
  });

  const selectedFrequency = watch('frequency');
  const selectedWaste = watch('fk_waste');

  // Resetear formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
    // Si el usuario es cliente, setear automáticamente su ID
    if (user?.role === 'client') {
      setValue('fk_client', user.id);
    }
  }, [initialData, reset, user, setValue]);

  // Filtrar subcategorías por residuo seleccionado (soporta fk_waste como número u objeto)
  const filteredSubcategories = wasteSubcategories.filter(
    (subcategory) =>
      !selectedWaste ||
      (typeof subcategory.fk_waste === 'object'
        ? subcategory.fk_waste.pk_waste === selectedWaste
        : subcategory.fk_waste === selectedWaste)
  );

  // Obtener fecha de hoy para min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Servicio Recurrente' : 'Crear Servicio Recurrente'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ej: Recolección semanal oficina central"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Solo mostrar el select de cliente si el usuario NO es cliente */}
          {user?.role !== 'client' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                {...register('fk_client', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((client) => (
                  <option key={client.pk_client} value={client.pk_client}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.fk_client && (
                <p className="mt-1 text-sm text-red-600">{errors.fk_client.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Ubicación y Tipo de Servicio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <select
              {...register('fk_location', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Seleccionar ubicación</option>
              {locations.map((location) => (
                <option key={location.pk_location} value={location.pk_location}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.fk_location && (
              <p className="mt-1 text-sm text-red-600">{errors.fk_location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Servicio *
            </label>
            <select
              {...register('fk_type_service', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo de servicio</option>
              {typeServices.map((type) => (
                <option key={type.pk_type_services} value={type.pk_type_services}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.fk_type_service && (
              <p className="mt-1 text-sm text-red-600">{errors.fk_type_service.message}</p>
            )}
          </div>
        </div>

        {/* Residuos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Residuo
            </label>
            <select
              {...register('fk_waste', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                setValue('fk_waste', value);
                setValue('fk_waste_subcategory', undefined); // Reset subcategory
              }}
            >
              <option value="">Seleccionar residuo (opcional)</option>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategoría de Residuo
            </label>
            <select
              {...register('fk_waste_subcategory', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!selectedWaste}
            >
              <option value="">Seleccionar subcategoría (opcional)</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory.pk_waste_subcategory} value={subcategory.pk_waste_subcategory}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            {errors.fk_waste_subcategory && (
              <p className="mt-1 text-sm text-red-600">{errors.fk_waste_subcategory.message}</p>
            )}
          </div>
        </div>

        {/* Configuración de recurrencia */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Configuración de Recurrencia</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frecuencia *
              </label>
              <select
                {...register('frequency')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Seleccionar frecuencia</option>
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.frequency && (
                <p className="mt-1 text-sm text-red-600">{errors.frequency.message}</p>
              )}
            </div>

            {selectedFrequency === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Personalizados *
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  {...register('custom_days', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 15"
                />
                {errors.custom_days && (
                  <p className="mt-1 text-sm text-red-600">{errors.custom_days.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              min={today}
              {...register('start_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin (Opcional)
            </label>
            <input
              type="date"
              min={today}
              {...register('end_date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.end_date && (
              <p className="mt-1 text-sm text-red-600">{errors.end_date.message}</p>
            )}
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas Adicionales
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Instrucciones especiales, observaciones, etc..."
          />
          {errors.notes && (
            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isEditing ? 'Actualizando...' : 'Creando...'}
              </div>
            ) : (
              isEditing ? 'Actualizar Servicio' : 'Crear Servicio'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecurringServiceForm;
