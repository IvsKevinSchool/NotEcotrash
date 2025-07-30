import { Location, LocationAPI, ManagementLocation, ClientLocation } from "../../types";
import { LocationRow } from "./LocationRow";

interface LocationTableProps {
    locations: ClientLocation[];
    onDelete: (id: string) => void;
}

export const LocationTable = ({ locations, onDelete }: LocationTableProps) => (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-600">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Dirección
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Código Postal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Ciudad/Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Contacto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Principal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
                {locations.map((clientLocation) => (
                    <LocationRow 
                        key={clientLocation.fk_location.pk_location} 
                        clientLocation={clientLocation}
                        onDelete={onDelete} 
                    />
                ))}
            </tbody>
        </table>
    </div>
);