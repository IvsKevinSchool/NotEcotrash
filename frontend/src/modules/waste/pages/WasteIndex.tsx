import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PlusIcon, ChevronDownIcon, ChevronRightIcon, TrashIcon, TagIcon, PencilIcon, ChartBarIcon, CubeIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getWasteSubcategories, getWasteSubcategory, createWasteSubcategory, updateWasteSubcategory, deleteWasteSubcategory, getWastes, createWaste, updateWaste, deleteWaste, WasteSubcategory, Waste, WasteSubcategoryFormData } from '../services/wasteSubcategoryService';
import WasteSubcategoryForm from '../components/WasteSubcategoryForm';
import { handleApiError } from '../../../components/handleApiError';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';

interface WasteFormData {
  name: string;
  description: string;
  is_active: boolean;
}

const WasteIndex = () => {
  const { user } = useAuth();
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [subcategories, setSubcategories] = useState<WasteSubcategory[]>([]);
  const [expandedWastes, setExpandedWastes] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  // Waste form states
  const [showWasteForm, setShowWasteForm] = useState(false);
  const [isEditingWaste, setIsEditingWaste] = useState(false);
  const [currentWasteId, setCurrentWasteId] = useState<number | null>(null);
  
  // Subcategory form states  
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
  const [currentSubcategoryId, setCurrentSubcategoryId] = useState<number | null>(null);
  const [selectedWasteForSubcategory, setSelectedWasteForSubcategory] = useState<number | null>(null);

  const wasteForm = useForm<WasteFormData>({
    defaultValues: {
      name: '',
      description: '',
      is_active: true
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [wastesData, subcategoriesData] = await Promise.all([
        getWastes(user?.id),
        getWasteSubcategories(user?.id)
      ]);
      setWastes(wastesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWasteExpansion = (wasteId: number) => {
    setExpandedWastes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wasteId)) {
        newSet.delete(wasteId);
      } else {
        newSet.add(wasteId);
      }
      return newSet;
    });
  };

  const getSubcategoriesForWaste = (wasteId: number): WasteSubcategory[] => {
    return subcategories.filter(subcategory => {
      const fkWaste = typeof subcategory.fk_waste === 'number' 
        ? subcategory.fk_waste 
        : subcategory.fk_waste.pk_waste;
      return fkWaste === wasteId;
    });
  };

  // Waste CRUD handlers
  const handleCreateWaste = async (data: WasteFormData) => {
    try {
      await createWaste(data, user?.id);
      toast.success('Residuo creado exitosamente');
      fetchData();
      resetWasteForm();
    } catch (error) {
      handleApiError(error, 'Error al crear residuo');
    }
  };

  const handleEditWaste = async (waste: Waste) => {
    setCurrentWasteId(waste.pk_waste);
    wasteForm.reset({
      name: waste.name,
      description: waste.description || '',
      is_active: true
    });
    setIsEditingWaste(true);
    // No mostrar el formulario inline para edición
    setShowWasteForm(false);
  };

  const handleUpdateWaste = async (data: WasteFormData) => {
    if (!currentWasteId) return;
    
    try {
      await updateWaste(currentWasteId, data, user?.id);
      toast.success('Residuo actualizado exitosamente');
      fetchData();
      resetWasteForm();
    } catch (error) {
      handleApiError(error, 'Error al actualizar residuo');
    }
  };

  const handleDeleteWaste = async (wasteId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este residuo? Se eliminarán también todas sus subcategorías.')) {
      try {
        await deleteWaste(wasteId, user?.id);
        toast.success('Residuo eliminado exitosamente');
        fetchData();
      } catch (error) {
        handleApiError(error, 'Error al eliminar residuo');
      }
    }
  };

  const resetWasteForm = () => {
    setShowWasteForm(false);
    setIsEditingWaste(false);
    setCurrentWasteId(null);
    wasteForm.reset({
      name: '',
      description: '',
      is_active: true
    });
  };

  // Subcategory CRUD handlers
  const handleCreateSubcategory = async (data: WasteSubcategoryFormData) => {
    try {
      await createWasteSubcategory(data, user?.id);
      toast.success('Subcategoría creada exitosamente');
      fetchData();
      resetSubcategoryForm();
    } catch (error) {
      handleApiError(error, 'Error al crear subcategoría');
    }
  };

  const handleEditSubcategory = async (id: number) => {
    try {
      const subcategory = await getWasteSubcategory(id);
      setCurrentSubcategoryId(id);
      setIsEditingSubcategory(true);
      // No mostrar el formulario inline para edición
      setShowSubcategoryForm(false);
    } catch (error) {
      handleApiError(error, 'Error al cargar subcategoría');
    }
  };

  const handleUpdateSubcategory = async (data: WasteSubcategoryFormData) => {
    if (!currentSubcategoryId) return;
    
    try {
      await updateWasteSubcategory(currentSubcategoryId, data, user?.id);
      toast.success('Subcategoría actualizada exitosamente');
      fetchData();
      resetSubcategoryForm();
    } catch (error) {
      handleApiError(error, 'Error al actualizar subcategoría');
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      try {
        await deleteWasteSubcategory(id, user?.id);
        toast.success('Subcategoría eliminada exitosamente');
        fetchData();
      } catch (error) {
        handleApiError(error, 'Error al eliminar subcategoría');
      }
    }
  };

  const resetSubcategoryForm = () => {
    setShowSubcategoryForm(false);
    setIsEditingSubcategory(false);
    setCurrentSubcategoryId(null);
    setSelectedWasteForSubcategory(null);
  };

  const getCurrentSubcategoryData = () => {
    if (!isEditingSubcategory || !currentSubcategoryId) return undefined;
    
    const subcategory = subcategories.find(s => s.pk_waste_subcategory === currentSubcategoryId);
    if (!subcategory) return undefined;

    return {
      name: subcategory.name || subcategory.description?.split(' ').slice(0, 4).join(' ') || '',
      description: subcategory.description,
      fk_waste: typeof subcategory.fk_waste === 'number' ? subcategory.fk_waste : subcategory.fk_waste.pk_waste,
      is_active: subcategory.is_active ?? true,
    };
  };

  const totalWastes = wastes.length;
  const totalSubcategories = subcategories.length;
  const activeWastes = wastes.filter(w => true).length; // Asumiendo que todos están activos por ahora
  const activeSubcategories = subcategories.filter(s => s.is_active).length;

  return (
    <div className="min-h-screen bg-green-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Gestión de Residuos</h1>
              <p className="text-sm text-green-600 mt-1">Administra tipos de residuos y sus subcategorías</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                if (!showWasteForm || isEditingWaste) {
                  setShowWasteForm(true);
                  setIsEditingWaste(false);
                } else {
                  setShowWasteForm(false);
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>{showWasteForm && !isEditingWaste ? 'Ocultar' : 'Nuevo Residuo'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <CubeIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Residuos</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalWastes}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TagIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Subcategorías</p>
                <h3 className="text-2xl font-bold text-gray-800">{totalSubcategories}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Residuos Activos</p>
                <h3 className="text-2xl font-bold text-gray-800">{activeWastes}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Subcategorías Activas</p>
                <h3 className="text-2xl font-bold text-gray-800">{activeSubcategories}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Form - Solo para crear */}
        {showWasteForm && !isEditingWaste && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nuevo Residuo
            </h3>
            <form onSubmit={wasteForm.handleSubmit(handleCreateWaste)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...wasteForm.register('name', { required: 'El nombre es requerido' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ingresa el nombre del residuo"
                  />
                  {wasteForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{wasteForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    {...wasteForm.register('description')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descripción del residuo"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetWasteForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subcategory Form - Solo para crear */}
        {showSubcategoryForm && !isEditingSubcategory && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nueva Subcategoría
            </h3>
            <WasteSubcategoryForm
              wastes={wastes}
              onSubmit={handleCreateSubcategory}
              onCancel={resetSubcategoryForm}
              isEditing={false}
              defaultWasteId={selectedWasteForSubcategory}
            />
          </div>
        )}

        {/* Modal de Edición de Residuo */}
        {isEditingWaste && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-green-300">
              <div className="flex items-center justify-between p-6 border-b border-green-200 bg-green-50/80 rounded-t-xl">
                <h3 className="text-xl font-semibold text-green-800">Editar Residuo</h3>
                <button
                  onClick={resetWasteForm}
                  className="text-green-400 hover:text-green-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <form onSubmit={wasteForm.handleSubmit(handleUpdateWaste)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...wasteForm.register('name', { required: 'El nombre es requerido' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ingresa el nombre del residuo"
                      />
                      {wasteForm.formState.errors.name && (
                        <p className="text-red-500 text-sm mt-1">{wasteForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <input
                        type="text"
                        {...wasteForm.register('description')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Descripción del residuo"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={resetWasteForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición de Subcategoría */}
        {isEditingSubcategory && (
          <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-green-300">
              <div className="flex items-center justify-between p-6 border-b border-green-200 bg-green-50/80 rounded-t-xl">
                <h3 className="text-xl font-semibold text-green-800">Editar Subcategoría</h3>
                <button
                  onClick={resetSubcategoryForm}
                  className="text-green-400 hover:text-green-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <WasteSubcategoryForm
                  wastes={wastes}
                  onSubmit={handleUpdateSubcategory}
                  onCancel={resetSubcategoryForm}
                  isEditing={true}
                  initialData={getCurrentSubcategoryData()}
                />
              </div>
            </div>
          </div>
        )}

        {/* Hierarchical Waste List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Lista de Residuos y Subcategorías</h2>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Cargando...</p>
              </div>
            ) : wastes.length === 0 ? (
              <div className="text-center py-8">
                <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay residuos registrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wastes.map((waste) => {
                  const wasteSubcategories = getSubcategoriesForWaste(waste.pk_waste);
                  const isExpanded = expandedWastes.has(waste.pk_waste);
                  
                  return (
                    <div key={waste.pk_waste} className="border border-gray-200 rounded-lg">
                      {/* Waste Row */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleWasteExpansion(waste.pk_waste)}
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                              <ChevronRightIcon className="h-5 w-5" />
                            )}
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-800">{waste.name}</h3>
                            {waste.description && (
                              <p className="text-sm text-gray-600">{waste.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {wasteSubcategories.length} subcategorías
                          </span>
                          <button
                            onClick={() => {
                              setSelectedWasteForSubcategory(waste.pk_waste);
                              setIsEditingSubcategory(false);
                              setShowSubcategoryForm(true);
                            }}
                            className="text-green-600 hover:text-green-700 transition-colors p-1 rounded"
                            title="Agregar subcategoría"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditWaste(waste)}
                            className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded"
                            title="Editar residuo"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteWaste(waste.pk_waste)}
                            className="text-red-600 hover:text-red-700 transition-colors p-1 rounded"
                            title="Eliminar residuo"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {isExpanded && (
                        <div className="p-4">
                          {wasteSubcategories.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              <TagIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p>No hay subcategorías para este residuo</p>
                              <button
                                onClick={() => {
                                  setSelectedWasteForSubcategory(waste.pk_waste);
                                  setIsEditingSubcategory(false);
                                  setShowSubcategoryForm(true);
                                }}
                                className="text-green-600 hover:text-green-700 text-sm font-medium mt-2"
                              >
                                Agregar primera subcategoría
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {wasteSubcategories.map((subcategory) => (
                                <div key={subcategory.pk_waste_subcategory} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <TagIcon className={`h-4 w-4 ${subcategory.is_active ? 'text-blue-500' : 'text-red-500'}`} />
                                        <h4 className={`font-medium text-sm ${subcategory.is_active ? 'text-gray-800' : 'text-red-600'}`}>
                                          {subcategory.name || 'Sin nombre'}
                                        </h4>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          subcategory.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {subcategory.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                      </div>
                                      <p className={`text-xs line-clamp-2 ${subcategory.is_active ? 'text-gray-600' : 'text-red-400'}`}>
                                        {subcategory.description}
                                      </p>
                                    </div>
                                    <div className="flex space-x-1 ml-2">
                                      <button
                                        onClick={() => handleEditSubcategory(subcategory.pk_waste_subcategory)}
                                        className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded"
                                        title="Editar subcategoría"
                                      >
                                        <PencilIcon className="h-3 w-3" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubcategory(subcategory.pk_waste_subcategory)}
                                        className="text-red-600 hover:text-red-700 transition-colors p-1 rounded"
                                        title="Eliminar subcategoría"
                                      >
                                        <TrashIcon className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteIndex;
