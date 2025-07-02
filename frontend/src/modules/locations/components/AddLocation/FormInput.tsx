// import { Icon } from "@heroicons/react/24/outline";
import { HandleFormChange } from "../../types";

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: HandleFormChange;
    type?: string;
    required?: boolean;
    placeholder?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
}

export const FormInput = ({
    id,
    name,
    label,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder = "",
    icon: Icon,
    className = ""
}: FormInputProps) => (
    <div className={`space-y-2 ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-green-700">
            {label}
        </label>
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                required={required}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${Icon ? 'pl-10' : ''}`}
                value={value}
                onChange={onChange}
            />
            {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
            )}
        </div>
    </div>
);