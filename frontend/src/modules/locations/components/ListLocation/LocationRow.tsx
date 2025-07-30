import { Link, useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon, MapPinIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Location, LocationActionHandler, LocationAPI, ClientLocation } from "../../types";

interface LocationRowProps {
    clientLocation: ClientLocation;
    onDelete: LocationActionHandler;
}

export const LocationRow = ({ clientLocation, onDelete }: LocationRowProps) => {
    const navigate = useNavigate();
    const { fk_location: location } = clientLocation;

    // Construir la dirección completa
    const fullAddress = `${location.street_name} ${location.exterior_number}${location.interior_number ? ` Int. ${location.interior_number}` : ''
        }${location.neighborhood ? `, ${location.neighborhood}` : ''}`;

    // Construir la ubicación geográfica
    const geoLocation = `${location.city}, ${location.state}, ${location.country}`;

    // Manejar la edición con navigate (opcional)
    const handleEdit = () => {
        navigate(`/admin/locations/edit/${clientLocation.pk_client_location}`, {
            state: { from: window.location.pathname } // Para poder volver atrás
        });
    };

    return (
        <tr key={location.pk_location} className="hover:bg-green-50">
            {/* Cliente */}
            <td className="px-3 py-4">
                <div className="text-sm font-medium text-gray-900">
                    {clientLocation.client_name || `Cliente #${clientLocation.fk_client}`}
                </div>
            </td>
            {/* Nombre con ícono */}
            <td className="px-3 py-4">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <BuildingOfficeIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="ml-2">
                        <div className="text-sm font-medium text-green-900">{location.name}</div>
                        <div className="text-xs text-green-500">
                            C.P. {location.postcode}
                        </div>
                    </div>
                </div>
            </td>
            {/* Dirección con ícono */}
            <td className="px-3 py-4">
                <div className="text-sm text-green-900 flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="break-words">{fullAddress}</span>
                </div>
            </td>
            {/* Código Postal */}
            <td className="px-3 py-4 text-center">
                <div className="text-sm text-green-500 font-medium">
                    {location.postcode}
                </div>
            </td>
            {/* Ciudad/Estado */}
            <td className="px-3 py-4">
                <div className="text-sm text-green-900 break-words">{geoLocation}</div>
            </td>
            {/* Contacto */}
            <td className="px-3 py-4">
                <div className="text-sm text-green-500">
                    {location.phone_number || 'N/A'}
                </div>
            </td>
            {/* Principal con badge */}
            <td className="px-3 py-4 text-center">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    clientLocation.is_main
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }`}>
                    {clientLocation.is_main ? 'Principal' : 'Secundaria'}
                </span>
            </td>
            {/* Acciones */}
            <td className="px-3 py-4">
                <div className="flex space-x-1 justify-center">
                    <button
                        onClick={handleEdit}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                        title="Editar"
                    >
                        <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(clientLocation.pk_client_location.toString())}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        title="Eliminar"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};