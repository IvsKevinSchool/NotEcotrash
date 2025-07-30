import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { ServiceLogFormData, serviceLogSchema } from "../schemas/serviceLogSchema";
import { getServiceLogs, getServiceLog, createServiceLog, updateServiceLog, deleteServiceLog, ServiceLog, ServiceLogFormPayload, } from "../services/serviceLogService";
import { getServices, getClients, getStatuses, getCollectors, Service, Client, Status, User } from "../services/filtersService";
import ServiceLogTable from "../components/ServiceLogTable";
import { useAuth } from "../../../context/AuthContext";
import { handleApiError } from "../../../components/handleApiError";

const ReportsIndex = () => {
  const [serviceLogs, setServiceLogs] = useState<ServiceLog[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({  service_id: '',  user_id: '',  client_id: '', status_id: '',  selected_date: '', });

  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceLogFormData>({
    resolver: zodResolver(serviceLogSchema),
  });

  useEffect(() => {
    fetchData();
    fetchRelatedData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filterParams: any = {};
      if (filters.service_id) filterParams.service_id = parseInt(filters.service_id);
      if (filters.user_id) filterParams.user_id = parseInt(filters.user_id);
      if (filters.client_id) filterParams.client_id = parseInt(filters.client_id);
      if (filters.status_id) filterParams.status_id = parseInt(filters.status_id);
      if (filters.selected_date) filterParams.selected_date = filters.selected_date;
      
      const data = await getServiceLogs(filterParams);
      setServiceLogs(data);
    } catch (error) {
      toast.error("Error al cargar bitácoras de servicio");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedData = async () => {
    try {
      // Obtener datos reales de la base de datos
      const [servicesData, clientsData, statusesData, collectorsData] = await Promise.all([
        getServices(),
        getClients(),
        getStatuses(),
        getCollectors()
      ]);

      setServices(servicesData);
      setClients(clientsData);
      setStatuses(statusesData);
      setUsers(collectorsData);
      
      console.log('Datos cargados:', {
        services: servicesData.length,
        clients: clientsData.length,
        statuses: statusesData.length,
        collectors: collectorsData.length
      });
    } catch (error) {
      console.error("Error fetching related data:", error);
      toast.error("Error al cargar datos de filtros");
    }
  };

  const onSubmit = async (data: ServiceLogFormData) => {
    try {
      const payload: ServiceLogFormPayload = {
        // completed_date se establece automáticamente en el backend
        waste_amount: data.waste_amount,
        notes: data.notes,
        fk_services: data.fk_services,
        fk_user: data.fk_user, // Ahora viene del formulario
      };

      if (isEditing && currentId) {
        await updateServiceLog(currentId, payload);
        toast.success("Bitácora actualizada exitosamente");
      } else {
        await createServiceLog(payload);
        toast.success("Bitácora creada exitosamente");
      }
      fetchData();
      resetForm();
    } catch (error) {
      handleApiError(error, "Error al guardar bitácora");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const serviceLog = await getServiceLog(id);
      reset({
        // completed_date ya no es editable
        waste_amount: serviceLog.waste_amount,
        notes: serviceLog.notes || '',
        fk_services: serviceLog.fk_services?.pk_services || 0,
        fk_user: serviceLog.fk_user?.id || 0,
      });
      setIsEditing(true);
      setCurrentId(id);
      setShowForm(true);
    } catch (error) {
      handleApiError(error, "Error al cargar bitácora");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta bitácora?")) {
      try {
        await deleteServiceLog(id);
        toast.success("Bitácora eliminada exitosamente");
        fetchData();
      } catch (error) {
        handleApiError(error, "Error al eliminar bitácora");
      }
    }
  };

  const resetForm = () => {
    reset();
    setIsEditing(false);
    setCurrentId(null);
    setShowForm(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const clearFilters = () => {
    setFilters({ 
      service_id: '', 
      user_id: '', 
      client_id: '', 
      status_id: '', 
      selected_date: '', // Solo una fecha
    });
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-800">Bitácoras de Servicio</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{showForm ? 'Ocultar Formulario' : 'Nueva Bitácora'}</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-green-700">Filtros de Búsqueda</h3>
          <div className="flex space-x-2">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-500 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-600 transition-colors duration-200"
            >
              Limpiar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Filtro por Fecha */}
          <div className="lg:col-span-1">
            <label className="block text-green-700 mb-1 text-sm font-medium">Fecha del Servicio</label>
            <input
              type="date"
              name="selected_date"
              value={filters.selected_date}
              min={getTodayDate()} // No permite fechas pasadas
              onChange={(e) => setFilters(prev => ({ ...prev, selected_date: e.target.value }))}
              className="w-full p-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Seleccionar fecha"
            />
            <p className="text-xs text-gray-500 mt-1">Solo fechas desde hoy en adelante</p>
          </div>

          {/* Filtro por Cliente */}
          <div>
            <label className="block text-green-700 mb-1 text-sm font-medium">Cliente</label>
            <select
              name="client_id"
              value={filters.client_id}
              onChange={handleFilterChange}
              className="w-full p-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos los clientes</option>
              {clients.map((client) => (
                <option key={client.pk_client} value={client.pk_client}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label className="block text-green-700 mb-1 text-sm font-medium">Estado</label>
            <select
              name="status_id"
              value={filters.status_id}
              onChange={handleFilterChange}
              className="w-full p-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos los estados</option>
              {statuses.map((status) => (
                <option key={status.pk_status} value={status.pk_status}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Servicio */}
          <div>
            <label className="block text-green-700 mb-1 text-sm font-medium">Servicio</label>
            <select
              name="service_id"
              value={filters.service_id}
              onChange={handleFilterChange}
              className="w-full p-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos los servicios</option>
              {services.map((service) => (
                <option key={service.pk_services} value={service.pk_services}>
                  #{service.service_number} - {service.fk_clients?.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por Recolector */}
          <div>
            <label className="block text-green-700 mb-1 text-sm font-medium">Recolector</label>
            <select
              name="user_id"
              value={filters.user_id}
              onChange={handleFilterChange}
              className="w-full p-2 text-sm border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos los recolectores</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.get_full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-green-200">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            {isEditing ? "Editar Bitácora" : "Nueva Bitácora"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Cantidad de Residuos */}
              <div>
                <label className="block text-green-700 mb-1">Cantidad de Residuos (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("waste_amount")}
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                {errors.waste_amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.waste_amount.message}</p>
                )}
              </div>

              {/* Servicio */}
              <div>
                <label className="block text-green-700 mb-1">Servicio</label>
                <select
                  {...register("fk_services", { valueAsNumber: true })}
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map((service) => (
                    <option key={service.pk_services} value={service.pk_services}>
                      #{service.service_number} - {service.fk_clients?.name}
                    </option>
                  ))}
                </select>
                {errors.fk_services && (
                  <p className="text-red-500 text-sm mt-1">{errors.fk_services.message}</p>
                )}
              </div>

              {/* Recolector */}
              <div>
                <label className="block text-green-700 mb-1">Recolector</label>
                <select
                  {...register("fk_user", { valueAsNumber: true })}
                  className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Seleccionar recolector</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.get_full_name}
                    </option>
                  ))}
                </select>
                {errors.fk_user && (
                  <p className="text-red-500 text-sm mt-1">{errors.fk_user.message}</p>
                )}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-green-700 mb-1">Notas</label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full p-2 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Observaciones adicionales sobre el servicio..."
              />
              {errors.notes && (
                <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors duration-200"
              >
                {isEditing ? "Actualizar" : "Crear"} Bitácora
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <ServiceLogTable
        serviceLogs={serviceLogs}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReportsIndex;
