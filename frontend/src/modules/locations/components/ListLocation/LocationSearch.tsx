import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface LocationSearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const LocationSearch = ({ searchTerm, onSearchChange }: LocationSearchProps) => (
    <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-green-700 mb-1">Buscar ubicación</label>
            <div className="relative">
                <input
                    type="text"
                    id="search"
                    placeholder="Buscar por empresa, dirección o contacto..."
                    className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-green-400" />
                </div>
            </div>
        </div>
    </div>
);