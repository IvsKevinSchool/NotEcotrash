import { ArrowPathIcon } from "@heroicons/react/24/outline";

export const LocationEmptyState = () => (
    <div className="text-center py-10">
        <ArrowPathIcon className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-lg font-medium text-green-800">No se encontraron ubicaciones</h3>
        <p className="mt-1 text-sm text-green-600">Intenta con otros términos de búsqueda o agrega una nueva ubicación.</p>
    </div>
);