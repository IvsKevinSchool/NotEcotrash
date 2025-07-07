import { useNavigate } from "react-router-dom";
import { AddLocationHeader } from "../components/AddLocation/AddLocationHeader";
import { AddLocationForm } from "../components/AddLocation/AddLocationForm";

export const AddLocation = () => {

    return (
        <div className="space-y-6">
            <AddLocationHeader />
            <AddLocationForm />
        </div>
    );
};