import { WasteForm } from "../components/WasteForm";
import { PageHeader } from "../components/PageHeader";

export const CreateWastePage = () => {

    return (
        <div className="max-w-md mx-auto p-6">
            <PageHeader
                title="Crear Nuevo Residuo"
                backUrl="/wastes"
            />
            <WasteForm />
        </div>
    );
};