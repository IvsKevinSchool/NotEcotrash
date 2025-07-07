import { Link, useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon, MapPinIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { Location, LocationActionHandler } from "../../types";

interface LocationRowProps {
    location: Location;
    onDelete: LocationActionHandler;
}

export const LocationRow = ({ location, onDelete }: LocationRowProps) => {
    const navigate = useNavigate();

    // Construir la dirección completa
    const fullAddress = `${location.street_name} ${location.exterior_number}${location.interior_number ? ` Int. ${location.interior_number}` : ''
        }${location.neighborhood ? `, ${location.neighborhood}` : ''}`;

    // Construir la ubicación geográfica
    const geoLocation = `${location.city}, ${location.state}, ${location.country}`;

    // Manejar la edición con navigate (opcional)
    const handleEdit = () => {
        navigate(`/admin/locations/edit/${location.pk_location}`, {
            state: { from: window.location.pathname } // Para poder volver atrás
        });
    };

    return (
        <tr key={location.pk_location} className="hover:bg-green-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-green-900">{location.name}</div>
                        <div className="text-sm text-green-500">
                            C.P. {location.postcode}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-green-900 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {fullAddress}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                {location.postcode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-green-900">{geoLocation}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-green-500">{location.phone_number}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                    {/* Opción 1: Mantener Link (recomendado para navegación básica) */}
                    {/* <Link
                        to={`/admin/locations/edit/${location.pk_location}`}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                        title="Editar"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link> */}

                    {/* Opción 2: Usar button + navigate (útil si necesitas lógica adicional) */}
                    <button
                        onClick={handleEdit}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                        title="Editar"
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>


                    <button
                        onClick={() => onDelete(location.pk_location)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                        title="Eliminar"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};