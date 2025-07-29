// pages/ListLocations.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { LocationTable } from "../components/ListLocation/LocationTable";
import { LocationSearch } from "../components/ListLocation/LocationSearch";
import { LocationLoading } from "../components/ListLocation/LocationLoading";
import { LocationEmptyState } from "../components/ListLocation/LocationEmptyState";
import { useLocations } from "../hooks/useLocations";
import { toast } from "react-toastify";

export const ListLocations = () => {
  const { locations, loading, fetchData, deleteLocation } = useLocations();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLocations = (locations || []).filter(({ fk_location }) => {
    const { name, street_name, phone_number } = fk_location;
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      street_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (phone_number && phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleDelete = (id: string) => {
    toast(
      <div>
        <p>¿Estás seguro de eliminar esta ubicación?</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => {
              deleteLocation(id);
              toast.dismiss();
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
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
        draggable: false,
        closeOnClick: false,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">Ubicaciones</h1>
        <Link
          to="/admin/locations/add"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Agregar Ubicación
        </Link>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <LocationSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <LocationLoading />
        ) : filteredLocations.length === 0 ? (
          <LocationEmptyState />
        ) : (
          <LocationTable
            locations={filteredLocations}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};