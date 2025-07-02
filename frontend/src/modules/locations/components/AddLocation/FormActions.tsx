import { useNavigate } from "react-router-dom";
import { CheckIcon } from "@heroicons/react/24/outline";

export const FormActions = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-end gap-4 pt-4">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                <CheckIcon className="h-5 w-5" />
                Guardar Ubicación
            </button>
        </div>
    );
};