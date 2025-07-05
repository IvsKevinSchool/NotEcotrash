import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { WasteForm } from "../components/WasteForm";
import { wasteService } from "../services/wasteService";
import { PageHeader } from "../components/PageHeader";

export const CreateWastePage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await wasteService.createWaste(data);
            toast.success("Residuo creado exitosamente");
            navigate("/wastes");
        } catch (error) {
            toast.error("Error al crear el residuo");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <PageHeader
                title="Crear Nuevo Residuo"
                backUrl="/wastes"
            />
            <WasteForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};