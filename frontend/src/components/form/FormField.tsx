import React from "react";

type FormFieldProps = {
    label: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
    className?: string;
    error?: string;

    ref?: React.Ref<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, name, type, placeholder, required, className, error, ref, onChange, onBlur }) => {
    const labelClass = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
    const inputClass = " bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm" +
        " rounded-lg focus:ring-blue-600 focus:border-blue-600 block" +
        " w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" +
        " dark:focus:ring-blue-500 dark:focus:border-blue-500";

    return (
        <div>
            <label htmlFor={label} className={labelClass}>{label}</label>
            <input type={type} id={id} name={name} className={inputClass + className} placeholder={placeholder} required={required}
                ref={ref} onChange={onChange} onBlur={onBlur} //  Add the ref, onChange, and onBlur props for react-hook-form
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default FormField