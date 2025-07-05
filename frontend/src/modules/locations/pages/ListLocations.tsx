import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Location } from "../types";
import { LocationTable } from "../components/ListLocation/LocationTable";
import { LocationSearch } from "../components/ListLocation/LocationSearch";
import { LocationLoading } from "../components/ListLocation/LocationLoading";
import { LocationEmptyState } from "../components/ListLocation/LocationEmptyState";

export const ListLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data actualizado con la nueva estructura
        const mockData: Location[] = [
          {
            pk_location: "1",
            name: "Oficinas Centrales",
            postal_code: "11520",
            exterior_number: "123",
            interior_number: "Piso 5",
            street_name: "Avenida Reforma",
            neighborhood: "Polanco",
            country: "México",
            city: "Ciudad de México",
            state: "CDMX",
            email: "contacto@empresa.com",
            phone_number: "+52 55 1234 5678"
          },
          {
            pk_location: "2",
            name: "Planta de Producción",
            postal_code: "54020",
            exterior_number: "456",
            street_name: "Boulevard Toluca",
            neighborhood: "Industrial",
            country: "México",
            city: "Toluca",
            state: "Estado de México",
            email: "produccion@empresa.com",
            phone_number: "+52 722 987 6543"
          }
        ];

        setTimeout(() => {
          setLocations(mockData);
          setLoading(false);
        }, 800);
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
    (location.email && location.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
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