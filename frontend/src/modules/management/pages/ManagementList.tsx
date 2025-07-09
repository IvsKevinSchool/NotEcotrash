// src/components/ManagementList.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { PlusCircleIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ManagementService } from '../services/managementService';
import { Management, ManagementListProps } from '../types/management';
import { managementFormSchema, ManagementFormValues } from '../schemas/managementSchema';

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

    const filteredManagements = managements.filter(management =>
        management.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        management.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        management.rfc.toLowerCase().includes(searchTerm.toLowerCase())
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
                const created = await ManagementService.create(data);
                setManagements([...managements, created]);
                toast.success('Contacto creado correctamente');
            }
            handleCloseModal();
        } catch (error) {
            console.log(error)
            toast.error(currentManagement ? 'Error al actualizar el contacto' : 'Error al crear el contacto');
        }
    };

    const handleEdit = (management: Management) => {
        setCurrentManagement(management);
        reset({
            name: management.name,
            email: management.email,
            phone_number: management.phone_number,
            phone_number_2: management.phone_number_2 || '',
            rfc: management.rfc
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

            {/* Modal para agregar/editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
                    <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-md border border-green-300">
                        <div className="p-4 border-b border-green-200 bg-green-50/80 rounded-t-lg">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-green-800">
                                    {currentManagement ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}
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
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">
                                        Nombre completo
                                    </label>
                                    <input
                                        id="name"
                                        {...register('name')}
                                        className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Resto de campos del formulario */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-green-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register('email')}
                                        className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone_number" className="block text-sm font-medium text-green-700 mb-1">
                                            Teléfono principal
                                        </label>
                                        <input
                                            id="phone_number"
                                            {...register('phone_number')}
                                            className={`w-full px-3 py-2 border ${errors.phone_number ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300`}
                                        />
                                        {errors.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone_number_2" className="block text-sm font-medium text-green-700 mb-1">
                                            Teléfono secundario
                                        </label>
                                        <input
                                            id="phone_number_2"
                                            {...register('phone_number_2')}
                                            className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="rfc" className="block text-sm font-medium text-green-700 mb-1">
                                        RFC
                                    </label>
                                    <input
                                        id="rfc"
                                        {...register('rfc')}
                                        className={`w-full px-3 py-2 border ${errors.rfc ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300`}
                                    />
                                    {errors.rfc && (
                                        <p className="mt-1 text-sm text-red-600">{errors.rfc.message}</p>
                                    )}
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
                                    {isSubmitting ? 'Guardando...' : currentManagement ? 'Guardar Cambios' : 'Agregar Contacto'}
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