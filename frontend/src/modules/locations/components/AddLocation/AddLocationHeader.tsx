import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const AddLocationHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-green-600 hover:text-green-800"
            >
                <ArrowLeftIcon className="h-5 w-5" />
                Volver
            </button>
            <h1 className="text-3xl font-bold text-green-700">Agregar Nueva Ubicación</h1>
            <div className="w-24"></div>
        </div>
    );
};