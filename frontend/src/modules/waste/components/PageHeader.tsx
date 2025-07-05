import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface PageHeaderProps {
    title: string;
    backUrl: string;
}

export const PageHeader = ({ title, backUrl }: PageHeaderProps) => {
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
            <h1 className="text-3xl font-bold text-green-700">{title}</h1>
        </div>
    )
};