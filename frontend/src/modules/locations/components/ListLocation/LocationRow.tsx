import { Link } from "react-router-dom";
import { TrashIcon, PencilIcon, MapPinIcon, BuildingOfficeIcon, ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Location, LocationActionHandler } from "../../types";

interface LocationRowProps {
    location: Location;
    onDelete: LocationActionHandler;
}

export const LocationRow = ({ location, onDelete }: LocationRowProps) => (
    <tr key={location.id} className="hover:bg-green-50">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-green-900">{location.companyName}</div>
                    <div className="text-sm text-green-500 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {location.address}
                    </div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-green-900">{location.contactPerson}</div>
            <div className="text-sm text-green-500">{location.phone}</div>
            <div className="text-sm text-green-500">{location.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {location.wasteType}
            </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
            <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {location.collectionFrequency}
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-green-900 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {location.nextCollection}
            </div>
            <div className="text-xs text-green-500">Última: {location.lastCollection}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex space-x-2">
                <Link
                    to={`/locations/edit/${location.id}`}
                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-100"
                    title="Editar"
                >
                    <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                    onClick={() => onDelete(location.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100"
                    title="Eliminar"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
        </td>
    </tr>
);