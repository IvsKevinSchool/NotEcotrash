import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddLocationHeader } from "../components/AddLocation/AddLocationHeader";
import { AddLocationForm } from "../components/AddLocation/AddLocationForm";
import { HandleFormChange, LocationFormData } from "../types";

export const AddLocation = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LocationFormData>({
        companyName: "",
        address: "",
        contactPerson: "",
        phone: "",
        email: "",
        wasteType: "Orgánico",
        collectionFrequency: "Semanal",
        nextCollection: "",
        coordinates: "",
        notes: ""
    });

    const handleChange: HandleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos al backend
        console.log("Datos enviados:", formData);
        // Simulamos éxito y redirigimos
        setTimeout(() => {
            navigate("/admin/locations", { state: { success: true } });
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <AddLocationHeader />
            <AddLocationForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
};