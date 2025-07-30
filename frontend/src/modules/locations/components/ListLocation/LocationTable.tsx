import { Location, LocationAPI, ManagementLocation, ClientLocation } from "../../types";
import { LocationRow } from "./LocationRow";

interface LocationTableProps {
    locations: ClientLocation[];
    onDelete: (id: string) => void;
}

export const LocationTable = ({ locations, onDelete }: LocationTableProps) => (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="w-full table-fixed divide-y divide-green-200">
            <thead className="bg-green-600">
                <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
                        Cliente
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-32">
                        Nombre
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-40">
                        Dirección
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-16">
                        C.P.
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-28">
                        Ciudad/Estado
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
                        Contacto
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-20">
                        Principal
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-24">
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