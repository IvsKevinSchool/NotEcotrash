import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { PlusCircleIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ManagementService } from '../services/managementService';
import { Management, ManagementListProps } from '../types/management';
import { managementFormSchema, ManagementFormValues } from '../schemas/managementSchema';
import { handleApiError } from '../../../components/handleApiError';

const ManagementList: React.FC<ManagementListProps> = ({
    title = "Gestión de Contactos",
    className = ""
}) => {
    const [managements, setManagements] = useState<Management[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentManagement, setCurrentManagement] = useState<Management | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ManagementFormValues>({
        resolver: zodResolver(managementFormSchema),
        defaultValues: {
            phone_number_2: "",
        }
    });

    useEffect(() => {
        const loadManagements = async () => {
            try {
                const data = await ManagementService.getAll();
                setManagements(data);
            } catch (error) {
                toast.error('Error al cargar los contactos');
            } finally {
                setLoading(false);
            }
        };

        loadManagements();
    }, []);

    console.log("Managements loaded:", managements);
    const filteredManagements = managements.filter(management =>
        management.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        management.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        management.rfc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onSubmit = async (data: ManagementFormValues) => {
        try {
            if (currentManagement) {
                const updated = await ManagementService.update(currentManagement.pk_management, data);
                setManagements(managements.map(m =>
                    m.pk_management === currentManagement.pk_management ? updated : m
                ));
                toast.success('Contacto actualizado correctamente');
            } else {
                // Usamos el endpoint de registro para crear nuevos managements
                const registrationData = {
                    ...data,
                    role: "management",
                    username: data.email.split('@')[0],
                    first_name: data.name.split(' ')[0] || data.name,
                    last_name: data.name.split(' ')[1] || ".",
                    password: "TempPass123",
                    password2: "TempPass123"
                };

                await ManagementService.register(registrationData);
                const fetchedManagements = await ManagementService.getAll();
                setManagements(fetchedManagements);
                toast.success('Contacto creado correctamente');
            }
            handleCloseModal();
        } catch (error) {
            console.error(error);
            handleApiError(error, currentManagement ? 'Error al actualizar el contacto' : 'Error al crear el contacto');
        }
    };

    const handleEdit = (management: Management) => {
        setCurrentManagement(management);
        reset({
            name: management.name,
            email: management.email,
            phone_number: management.phone_number,
            phone_number_2: management.phone_number_2,
            rfc: management.rfc || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        toast.info(
            <div>
                <p>¿Estás seguro de eliminar este contacto?</p>
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                await ManagementService.delete(id);
                                setManagements(managements.filter(m => m.pk_management !== id));
                                toast.success('Contacto eliminado correctamente');
                            } catch (error) {
                                toast.error('Error al eliminar el contacto');
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                        Eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-300 rounded"
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

    const handleCloseModal = () => {
        reset();
        setCurrentManagement(null);
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-64 ${className}`}>
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }


    return (
        <div className={`bg-white rounded-lg shadow-sm ${className}`}>
            {/* Header del componente */}
            <div className="p-4 border-b border-green-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                        <span className="text-green-500">🌿</span> {title}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar contactos..."
                                className="block w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            <span>Agregar</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats y Tabla (mantener igual que en tu versión) */}
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-green-50">
                <div className="bg-white rounded-lg p-3 shadow-xs border border-green-100">
                    <p className="text-sm text-green-600">Total contactos</p>
                    <p className="text-2xl font-bold text-green-800">{managements.length}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-xs border border-green-100">
                    <p className="text-sm text-green-600">Con email</p>
                    <p className="text-2xl font-bold text-green-800">
                        {managements.filter(m => m.email).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-xs border border-green-100">
                    <p className="text-sm text-green-600">Con teléfono 2</p>
                    <p className="text-2xl font-bold text-green-800">
                        {managements.filter(m => m.phone_number_2).length}
                    </p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-xs border border-green-100">
                    <p className="text-sm text-green-600">Mostrando</p>
                    <p className="text-2xl font-bold text-green-800">
                        {filteredManagements.length}
                    </p>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Teléfono 2
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                RFC
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-green-200">
                        {filteredManagements.length > 0 ? (
                            filteredManagements.map((management) => (
                                <tr
                                    key={management.pk_management}
                                    className="hover:bg-green-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                        {management.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        <a
                                            href={`mailto:${management.email}`}
                                            className="hover:text-green-800 hover:underline"
                                        >
                                            {management.email}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {management.phone_number}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {management.phone_number_2 || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">
                                        {management.rfc}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(management)}
                                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100"
                                            title="Editar"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(management.pk_management)}
                                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                                            title="Eliminar"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-green-600">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer del componente */}
            <div className="p-3 border-t border-green-100 bg-green-50 text-center">
                <p className="text-xs text-green-600">
                    ♻️ Mostrando {filteredManagements.length} de {managements.length} registros
                </p>
            </div>

            {/* Modal modificado */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
                    <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-md border border-green-300">
                        <div className="p-4 border-b border-green-200 bg-green-50/80 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-green-800">
                                    {currentManagement ? 'Editar Contacto' : 'Registrar Nueva Empresa'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-green-600 hover:text-green-800 transition-colors p-1 rounded-full hover:bg-green-100"
                                    aria-label="Cerrar modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                            <div className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Nombre de la Empresa *</label>
                                    <input
                                        type="text"
                                        {...register("name")}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.name ? "border-red-500" : "border-green-300"
                                            }`}
                                        placeholder="Ingrese el nombre de la empresa"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Email *</label>
                                    <input
                                        type="email"
                                        {...register("email")}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? "border-red-500" : "border-green-300"
                                            }`}
                                        placeholder="Ingrese el email corporativo"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* RFC */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">RFC *</label>
                                    <input
                                        type="text"
                                        {...register("rfc")}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.rfc ? "border-red-500" : "border-green-300"
                                            }`}
                                        placeholder="Ingrese el RFC (12-13 caracteres)"
                                        maxLength={13}
                                    />
                                    {errors.rfc && (
                                        <p className="text-red-500 text-sm mt-1">{errors.rfc.message}</p>
                                    )}
                                </div>

                                {/* Teléfono principal */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Teléfono Principal *</label>
                                    <input
                                        type="tel"
                                        {...register("phone_number")}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.phone_number ? "border-red-500" : "border-green-300"
                                            }`}
                                        placeholder="Ingrese el teléfono principal"
                                    />
                                    {errors.phone_number && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                                    )}
                                </div>

                                {/* Teléfono secundario (opcional) */}
                                <div>
                                    <label className="block text-green-700 mb-1 font-medium">Teléfono Secundario (Opcional)</label>
                                    <input
                                        type="tel"
                                        {...register("phone_number_2")}
                                        className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        placeholder="Ingrese teléfono secundario"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : currentManagement ? (
                                        'Guardar Cambios'
                                    ) : (
                                        'Registrar Empresa'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagementList;