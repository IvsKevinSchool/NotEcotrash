import React from "react";

export interface SelectFieldProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    id: string;
    name: string;
    options: { value: number | undefined | string; label: string }[];
    required?: boolean;
    error?: string;
    className?: string;
}

const SelectField = React.forwardRef<
    HTMLSelectElement,
    SelectFieldProps
>(({
    label,
    id,
    name,
    options,
    required,
    error,
    className = "bg-white border border-gray-300 p-2 rounded",
    ...rest
}, ref) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="mb-2 font-medium">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select id={id} name={name} ref={ref} className={className} {...rest}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
});

export default SelectField;