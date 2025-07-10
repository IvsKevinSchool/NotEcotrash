import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ServiceFormData, serviceSchema } from "../schemas/serviceSchema";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../api/serviceServices";
import ServiceForm from "../components/ServiceForm";
import ServicesTable from "../components/ServiceTable";

const ServicesIndex = () => {
  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [typeServices, setTypeServices] = useState<any[]>([]);
  const [wastes, setWastes] = useState<any[]>([]);
  const [wasteSubcategories, setWasteSubcategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const selectedWaste = form.watch("fk_waste");

  useEffect(() => {
    fetchData();
    // In a real app, you would fetch these from their respective APIs
    setClients([
      { pk_client: 8, name: "Cliente Ejemplo", legal_name: "Cliente S.A. de C.V." },
    ]);
    setLocations([
      { pk_location: 3, name: "Zona Rio", city: "Tijuana" },
    ]);
    setStatuses([
      { pk_status: 1, name: "Completed", description: "Service completed successfully" },
    ]);
    setTypeServices([
      { pk_type_services: 2, name: "Recoleccion", description: "Recolección de basura" },
    ]);
    setWastes([
      { pk_waste: 2, name: "Caja Bachoco", description: "Esta mojadita" },
    ]);
    setWasteSubcategories([
      { pk_waste_subcategory: 1, description: "subcategory 1", fk_waste: 2 },
    ]);
  }, []);

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
      if (isEditing && currentId) {
        await updateService(currentId, data);
        showSuccessToast("Service updated successfully");
      } else {
        await createService(data);
        showSuccessToast("Service created successfully");
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      showErrorToast("Error saving service");
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