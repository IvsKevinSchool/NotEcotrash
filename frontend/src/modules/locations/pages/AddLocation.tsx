import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationFormData } from "../schemas";
import { useNavigate } from "react-router-dom";
import { AddLocationHeader } from "../components/AddLocation/AddLocationHeader";
import { AddLocationForm } from "../components/AddLocation/AddLocationForm";
import axios from "axios";

export const AddLocation = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <AddLocationHeader />
            <AddLocationForm />
        </div>
    );
};