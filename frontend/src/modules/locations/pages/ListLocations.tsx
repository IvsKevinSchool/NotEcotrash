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
        // Mock data - en producción sería una llamada API
        const mockData: Location[] = [
          {
            id: "1",
            companyName: "EcoTech Solutions",
            address: "Av. Ecológica 123, Ciudad Verde",
            contactPerson: "María González",
            phone: "+1 234 567 890",
            email: "contacto@ecotech.com",
            wasteType: "Electrónicos",
            collectionFrequency: "Semanal",
            lastCollection: "2023-05-15",
            nextCollection: "2023-05-22",
            coordinates: "12.3456, -98.7654",
            notes: "Solo recoger después de las 3pm"
          },
          {
            id: "2",
            companyName: "Verde Futuro SA",
            address: "Calle Sustentable 456, Distrito Eco",
            contactPerson: "Carlos Mendoza",
            phone: "+1 987 654 321",
            email: "info@verdefuturo.com",
            wasteType: "Orgánico",
            collectionFrequency: "Diario",
            lastCollection: "2023-05-20",
            nextCollection: "2023-05-21",
            coordinates: "12.3789, -98.7321",
            notes: "Tienen contenedores especiales"
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
    location.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta ubicación?")) {
      setLocations(locations.filter(location => location.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">Ubicaciones de Recolección</h1>
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