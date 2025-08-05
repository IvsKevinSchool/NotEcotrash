import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { ServiceFormData, serviceSchema } from "../schemas/serviceSchema";
import { getServices, getService, createService, updateService, deleteService, } from "../api/serviceServices";
import {  getServiceFormData, Client,  Location,  Status,  TypeService,  Waste,  WasteSubcategory } from "../api/serviceFormServices";
import ServiceForm from "../components/ServiceForm";
import ServicesTable from "../components/ServiceTable";

const ServicesIndex = () => {
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [typeServices, setTypeServices] = useState<TypeService[]>([]);
  const [wastes, setWastes] = useState<Waste[]>([]);
  const [wasteSubcategories, setWasteSubcategories] = useState<WasteSubcategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [currentService, setCurrentService] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultStatusId, setDefaultStatusId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { user } = useAuth();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    mode: 'onChange', // Validar en tiempo real cuando cambian los campos
    defaultValues: {
      scheduled_date: "",
      fk_clients: undefined,
      fk_locations: undefined,
      fk_status: 1, // Estado por defecto: "En progreso"
      fk_type_services: undefined,
      fk_waste: undefined,
      fk_waste_subcategory: undefined,
    }
  });

  const { formState: { errors, isSubmitting, isValid } } = form;

  // Función para traducir nombres de campos a español
  const getFieldLabel = (fieldName: string): string => {
    const fieldLabels: Record<string, string> = {
      scheduled_date: "Fecha Programada",
      fk_clients: "Cliente",
      fk_locations: "Ubicación", 
      fk_status: "Estado",
      fk_type_services: "Tipo de Servicio",
      fk_waste: "Tipo de Residuo",
      fk_waste_subcategory: "Subcategoría de Residuo"
    };
    return fieldLabels[fieldName] || fieldName;
  };

  const selectedWaste = form.watch("fk_waste");
  const selectedTypeService = form.watch("fk_type_services");

  // Log de errores para debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

  // Determinar si el tipo de servicio seleccionado es "Recolección de residuos"
  const isWasteCollectionService = () => {
    if (!selectedTypeService || typeServices.length === 0) return false;
    
    const selectedService = typeServices.find(service => service.pk_type_services === selectedTypeService);
    if (!selectedService) return false;
    
    // Buscar si el nombre del servicio contiene palabras relacionadas con recolección de residuos
    const serviceName = selectedService.name.toLowerCase();
    return serviceName.includes('recolección') || 
           serviceName.includes('recoleccion') || 
           serviceName.includes('residuo') ||
           serviceName.includes('waste') ||
           serviceName.includes('collection');
  };

  useEffect(() => {
    fetchData();
    fetchFormData();
  }, []);

  // Resetear subcategoría cuando cambia el residuo seleccionado
  useEffect(() => {
    if (selectedWaste) {
      // Filtrar subcategorías que pertenecen al residuo seleccionado
      const filteredSubcategories = wasteSubcategories.filter(sub => {
        const wasteId = typeof sub.fk_waste === 'object' ? sub.fk_waste.pk_waste : sub.fk_waste;
        return wasteId === selectedWaste;
      });
      
      // Solo resetear si ya había una subcategoría seleccionada
      const currentSubcategory = form.getValues("fk_waste_subcategory");
      if (currentSubcategory) {
        // Verificar si la subcategoría actual pertenece al nuevo residuo seleccionado
        const subcategoryBelongsToWaste = filteredSubcategories.find(
          sub => sub.pk_waste_subcategory === currentSubcategory
        );
        
        // Si no pertenece, resetear la subcategoría
        if (!subcategoryBelongsToWaste) {
          form.setValue("fk_waste_subcategory", undefined);
        }
      }
    } else {
      // Si no hay residuo seleccionado, limpiar subcategoría
      form.setValue("fk_waste_subcategory", undefined);
    }
  }, [selectedWaste, wasteSubcategories, form]);

  // Limpiar campos de residuo cuando el tipo de servicio no sea recolección de residuos
  useEffect(() => {
    if (!isWasteCollectionService()) {
      // Si no es servicio de recolección, limpiar campos de residuo
      form.resetField("fk_waste");
      form.resetField("fk_waste_subcategory");
    }
  }, [selectedTypeService, typeServices, form]);

  const fetchFormData = async () => {
    try {
      const data = await getServiceFormData(user?.id);
      setClients(data.clients);
      setLocations(data.locations);
      setStatuses(data.statuses);
      setTypeServices(data.typeServices);
      setWastes(data.wastes);
      setWasteSubcategories(data.wasteSubcategories);

      // Buscar el estado "En progreso" para establecerlo como default
      const inProgressStatus = data.statuses.find(status => 
        status.name.toLowerCase().includes('en progreso') || 
        status.name.toLowerCase().includes('progreso') ||
        status.name.toLowerCase().includes('in progress')
      );
      if (inProgressStatus) {
        setDefaultStatusId(inProgressStatus.pk_status);
      } else {
        // Si no hay estado "En progreso", usar el primer estado disponible o null
        setDefaultStatusId(data.statuses.length > 0 ? data.statuses[0].pk_status : null);
      }

      console.log('Datos del formulario cargados:', {
        clients: data.clients.length,
        locations: data.locations.length,
        statuses: data.statuses.length,
        typeServices: data.typeServices.length,
        wastes: data.wastes.length,
        wasteSubcategories: data.wasteSubcategories.length
      });
    } catch (error) {
      console.error("Error fetching form data:", error);
      showErrorToast("Error al cargar datos del formulario");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await getServices(user?.id); // Pasar management_id
      setServices(data);
    } catch (error) {
      showErrorToast("Error fetching services");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para mostrar toasts de éxito
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Función para mostrar toasts de error
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onSubmit = async (data: ServiceFormData) => {
    console.log("Submitting service data:", data);
    console.log("Form errors:", errors);
    
    try {
      // Validación adicional para servicios de recolección
      if (isWasteCollectionService()) {
        if (!data.fk_waste) {
          showErrorToast("Para servicios de recolección, debe seleccionar un residuo");
          return;
        }
      }

      // Limpiar campos de residuo si no es servicio de recolección
      let serviceData = { ...data };
      if (!isWasteCollectionService()) {
        delete serviceData.fk_waste;
        delete serviceData.fk_waste_subcategory;
      }

      if (isEditing && currentId) {
        // Al editar, mantener el estado actual del servicio
        await updateService(currentId, serviceData);
        showSuccessToast("Servicio actualizado exitosamente");
      } else {
        // Al crear, asignar management_id del usuario logueado
        // El fk_status ya viene del formulario (valor por defecto: 1 = "En progreso")
        const newServiceData = {
          ...serviceData,
          fk_management: user?.id // Asignar management_id del usuario logueado
        };
        await createService(newServiceData);
        showSuccessToast("Servicio creado exitosamente");
      }
      fetchData();
      resetForm();
    } catch (error: any) {
      console.error("Error saving service:", error);
      
      // Manejo específico de errores de validación del backend
      if (error?.response?.data) {
        const backendErrors = error.response.data;
        
        // Si el backend devuelve errores específicos por campo
        if (typeof backendErrors === 'object') {
          Object.keys(backendErrors).forEach(field => {
            const errorMessage = Array.isArray(backendErrors[field]) 
              ? backendErrors[field][0] 
              : backendErrors[field];
            showErrorToast(`${getFieldLabel(field)}: ${errorMessage}`);
          });
        } else {
          showErrorToast(backendErrors.message || "Error al guardar servicio");
        }
      } else {
        showErrorToast("Error al guardar servicio");
      }
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const service = await getService(id);
      setCurrentService(service);
      const formData = {
        ...service,
        fk_clients: service.fk_clients.pk_client,
        fk_locations: service.fk_locations.pk_location,
        fk_status: service.fk_status.pk_status,
        fk_type_services: service.fk_type_services.pk_type_services,
        fk_waste: service.fk_waste.pk_waste,
        fk_waste_subcategory: service.fk_waste_subcategory?.pk_waste_subcategory,
      };
      form.reset(formData);
      setIsEditing(true);
      setCurrentId(id);
      setShowForm(true);
    } catch (error) {
      toast.error("Error al cargar servicio para editar");
    }
  };

  const handleDelete = (id: number) => {
    toast.success(
      <div>
        <p>¿Estás seguro de eliminar este servicio?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await deleteService(id);
                toast.success("Servicio eliminado exitosamente");
                fetchData();
              } catch (error) {
                toast.error("Error al eliminar servicio");
              }
            }}
            className="px-3 py-1 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const handleAdd = () => {
    // Limpiar el formulario y estado para agregar nuevo
    form.reset({
      scheduled_date: "",
      fk_clients: "" as any,
      fk_locations: "" as any,
      fk_status: 1, // Estado por defecto: "En progreso"
      fk_type_services: "" as any,
      fk_waste: "" as any,
      fk_waste_subcategory: "" as any,
    });
    setCurrentService(null);
    setIsEditing(false);
    setCurrentId(null);
    setShowForm(true);
  };

  const resetForm = () => {
    form.reset({
      scheduled_date: "",
      fk_clients: "" as any,
      fk_locations: "" as any,
      fk_status: 1, // Estado por defecto: "En progreso"
      fk_type_services: "" as any,
      fk_waste: "" as any,
      fk_waste_subcategory: "" as any,
    });
    setCurrentService(null);
    setIsEditing(false);
    setCurrentId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Mostrar errores de validación si existen */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2 flex items-center gap-2">
              <span>⚠️</span>
              Errores de validación:
            </h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>
                    <strong>{getFieldLabel(field)}:</strong> {error?.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ServiceForm
          form={form}
          clients={clients}
          locations={locations}
          statuses={statuses}
          typeServices={typeServices}
          wastes={wastes}
          wasteSubcategories={wasteSubcategories}
          isEditing={isEditing}
          currentService={currentService}
          onSubmit={onSubmit}
          onClose={resetForm}
          selectedWaste={selectedWaste}
          isWasteCollectionService={isWasteCollectionService()}
          isModalOpen={showForm}
        />

        <ServicesTable
          services={services}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
};

export default ServicesIndex;