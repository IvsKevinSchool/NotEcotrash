import React from "react";

// FormSelect.tsx
interface FormSelectProps {
    id: string;
    label: string;
    error?: { message?: string };
    options: string[];
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps & React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ id, label, error, options, icon: Icon, ...props }, ref) => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-green-700">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    ref={ref}
                    className={`w-full px-4 py-2 border ${error ? "border-red-300" : "border-green-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${Icon ? "pl-10" : ""
                        }`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    )
);
