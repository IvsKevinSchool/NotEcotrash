import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { 
  getWasteSubcategories, 
  getWasteSubcategory,
  createWasteSubcategory,
  updateWasteSubcategory,
  deleteWasteSubcategory,
  getWastes,
  WasteSubcategory,
  Waste,
  WasteSubcategoryFormData
} from '../services/wasteSubcategoryService';
import WasteSubcategoryTable from '../components/WasteSubcategoryTable';
import WasteSubcategoryForm from '../components/WasteSubcategoryForm';
import { handleApiError } from '../../../components/handleApiError';

const WasteSubcategoryIndex = () => {
  const [subcategories, setSubcategories] = useState<WasteSubcategory[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchWastes();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getWasteSubcategories();
      console.log('Subcategorías obtenidas del backend:', data); // Debug temporal
      setSubcategories(data);
    } catch (error) {
      console.error('Error detallado al cargar subcategorías:', error);
      toast.error('Error al cargar subcategorías de residuos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWastes = async () => {
    try {
      const data = await getWastes();
      setWastes(data);
    } catch (error) {
      toast.error('Error al cargar residuos');
    }
  };

  const handleCreate = async (data: WasteSubcategoryFormData) => {
    try {
      await createWasteSubcategory(data);
      toast.success('Subcategoría creada exitosamente');
      fetchData();
      resetForm();
    } catch (error) {
      handleApiError(error, 'Error al crear subcategoría');
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const subcategory = await getWasteSubcategory(id);
      setCurrentId(id);
      setIsEditing(true);
      setShowForm(true);
    } catch (error) {
      handleApiError(error, 'Error al cargar subcategoría');
    }
  };

  const handleUpdate = async (data: WasteSubcategoryFormData) => {
    if (!currentId) return;
    
    try {
      await updateWasteSubcategory(currentId, data);
      toast.success('Subcategoría actualizada exitosamente');
      fetchData();
      resetForm();
    } catch (error) {
      handleApiError(error, 'Error al actualizar subcategoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      try {
        await deleteWasteSubcategory(id);
        toast.success('Subcategoría eliminada exitosamente');
        fetchData();
      } catch (error) {
        handleApiError(error, 'Error al eliminar subcategoría');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentId(null);
  };

  const getCurrentSubcategoryData = () => {
    if (!isEditing || !currentId) return undefined;
    
    const subcategory = subcategories.find(s => s.pk_waste_subcategory === currentId);
    if (!subcategory) return undefined;

    return {
      name: subcategory.name || subcategory.description?.split(' ').slice(0, 4).join(' ') || '',
      description: subcategory.description,
      fk_waste: typeof subcategory.fk_waste === 'number' ? subcategory.fk_waste : subcategory.fk_waste.pk_waste,
      is_active: subcategory.is_active ?? true,
    };
  };

  return (
    <div className="min-h-screen bg-green-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Subcategorías de Residuos</h1>
              <p className="text-sm text-green-600 mt-1">Gestiona las subcategorías de tipos de residuos</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <PlusIcon className="h-5 w-5" />
            <span>{showForm ? 'Ocultar Formulario' : 'Nueva Subcategoría'}</span>
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-6 sm:mb-8">
            <WasteSubcategoryForm
              wastes={wastes}
              onSubmit={isEditing ? handleUpdate : handleCreate}
              onCancel={resetForm}
              isEditing={isEditing}
              initialData={getCurrentSubcategoryData()}
            />
          </div>
        )}

        {/* Tabla */}
        <div className="w-full">
          <WasteSubcategoryTable
            subcategories={subcategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default WasteSubcategoryIndex;
