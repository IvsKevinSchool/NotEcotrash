import React from "react";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    id: string;
    name: string;
    type: string;
    placeholder: string;
    required?: boolean;
    className?: string;
    error?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, id, name, type, placeholder, required, className, error, ...rest }, ref) => {
        // const labelClass = "block mb-2 text-sm font-medium dark:text-white";
        // const inputClass = " bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm" +
        //     " rounded-lg focus:ring-blue-600 focus:border-blue-600 block" +
        //     " w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" +
        //     " dark:focus:ring-blue-500 dark:focus:border-blue-500";
        const labelClass = ''
        const inputClass = 'bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm p-2'

        return (
            <div className="flex flex-col">
                <div className="flex flex-col ">
                    <label htmlFor={label} className={`mb-2 relative`}>
                        {label}
                    </label>

                    <input
                        id={id}
                        name={name}
                        ref={ref}
                        className={`w-full px-1 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 
                            focus:border-blue-600 font-light transition ${error ? 'border-red-500' : ''}`}
                        type={type}
                        {...rest}
                    />
                </div>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    })

export default FormField