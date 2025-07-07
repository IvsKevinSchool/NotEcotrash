import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Location } from "../types";
import { LocationTable } from "../components/ListLocation/LocationTable";
import { LocationSearch } from "../components/ListLocation/LocationSearch";
import { LocationLoading } from "../components/ListLocation/LocationLoading";
import { LocationEmptyState } from "../components/ListLocation/LocationEmptyState";
import api from "../../../api";

export const ListLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api('core/locations/')

        console.log(response)

        setLocations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.street_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (location.phone_number && location.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta ubicación?")) {
      setLocations(locations.filter(location => location.pk_location !== id));
    }
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