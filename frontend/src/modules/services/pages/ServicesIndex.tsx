import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { ServiceFormData, serviceSchema } from "../schemas/serviceSchema";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../api/serviceServices";
import { 
  getServiceFormData,
  Client, 
  Location, 
  Status, 
  TypeService, 
  Waste, 
  WasteSubcategory 
} from "../api/serviceFormServices";
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
  const [isLoading, setIsLoading] = useState(false);
  const [defaultStatusId, setDefaultStatusId] = useState<number | null>(null);

  const { user } = useAuth();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const selectedWaste = form.watch("fk_waste");
  const selectedTypeService = form.watch("fk_type_services");

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
      const data = await getServices();
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

      // Asignar automáticamente el estado "En progreso" si no se especifica uno
      serviceData = {
        ...serviceData,
        fk_status: defaultStatusId || serviceData.fk_status
      };

      if (isEditing && currentId) {
        await updateService(currentId, serviceData);
        showSuccessToast("Servicio actualizado exitosamente");
      } else {
        await createService(serviceData);
        showSuccessToast("Servicio creado exitosamente");
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      showErrorToast("Error al guardar servicio");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const service = await getService(id);
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
    } catch (error) {
      showErrorToast("Error fetching service for edit");
    }
  };

  const handleDelete = (id: number) => {
    const toastId = toast(
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">¿Estás seguro?</h3>
        <p className="mb-4">Esta acción eliminará permanentemente el servicio.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              confirmDelete(id);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        className: "w-full max-w-md",
      }
    );
  };

  const confirmDelete = async (id: number) => {
    try {
      await deleteService(id);
      showSuccessToast("Service deleted successfully");
      fetchData();
    } catch (error) {
      showErrorToast("Error deleting service");
    }
  };

  const resetForm = () => {
    form.reset();
    setIsEditing(false);
    setCurrentId(null);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8">Gestión de Servicios</h1>

        <ServiceForm
          form={form}
          clients={clients}
          locations={locations}
          statuses={statuses}
          typeServices={typeServices}
          wastes={wastes}
          wasteSubcategories={wasteSubcategories}
          isEditing={isEditing}
          onSubmit={onSubmit}
          onReset={resetForm}
          selectedWaste={selectedWaste}
          isWasteCollectionService={isWasteCollectionService()}
        />

        <ServicesTable
          services={services}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ServicesIndex;