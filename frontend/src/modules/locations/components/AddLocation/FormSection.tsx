import { ReactNode } from "react";
//import { Icon } from "@heroicons/react/24/outline";

interface FormSectionProps {
    title: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children: ReactNode;
}

export const FormSection = ({ title, icon: Icon, children }: FormSectionProps) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
        </div>
    </div>
);