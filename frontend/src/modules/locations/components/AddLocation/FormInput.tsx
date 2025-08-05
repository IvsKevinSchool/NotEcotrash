import { useFormContext } from "react-hook-form";

interface FormInputProps {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    optional?: boolean;
    disabled?: boolean;
    inputMode?: "text" | "numeric" | "tel" | "email";
}

export const FormInput = ({
    name,
    label,
    type = "text",
    placeholder = "",
    optional = false,
    disabled = false,
    inputMode
}: FormInputProps) => {
    const { register, formState: { errors } } = useFormContext();

    // Función para obtener errores anidados
    const getNestedError = (name: string) => {
        const keys = name.split('.');
        let error: any = errors;
        
        for (const key of keys) {
            if (error && typeof error === 'object' && key in error) {
                error = error[key];
            } else {
                return undefined;
            }
        }
        
        return error;
    };

    const fieldError = getNestedError(name);
    const errorMessage = fieldError?.message || (typeof fieldError === 'string' ? fieldError : undefined);

    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {optional && <span className="text-gray-400">(opcional)</span>}
            </label>
            <input
                id={name}
                type={type}
                inputMode={inputMode}
                placeholder={placeholder}
                disabled={disabled}
                className={`block w-full px-3 py-2 border ${
                    fieldError ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                } rounded-md shadow-sm focus:outline-none focus:ring-2`}
                {...register(name)}
                aria-invalid={fieldError ? "true" : "false"}
            />
            {fieldError && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                    {errorMessage || 'Error de validación'}
                </p>
            )}
        </div>
    );
};