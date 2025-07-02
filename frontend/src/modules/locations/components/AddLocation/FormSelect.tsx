//import { Icon } from "@heroicons/react/24/outline";
import { HandleFormChange } from "../../types";

interface FormSelectProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: HandleFormChange;
    options: string[];
    required?: boolean;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const FormSelect = ({
    id,
    name,
    label,
    value,
    onChange,
    options,
    required = false,
    icon: Icon
}: FormSelectProps) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-green-700">
            {label}
        </label>
        <div className="relative">
            <select
                id={id}
                name={name}
                required={required}
                className={`w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${Icon ? 'pl-10' : ''}`}
                value={value}
                onChange={onChange}
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
            )}
        </div>
    </div>
);