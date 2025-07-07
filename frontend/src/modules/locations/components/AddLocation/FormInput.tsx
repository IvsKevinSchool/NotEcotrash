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
                className={`block w-full px-3 py-2 border ${errors[name] ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                {...register(name)}
                aria-invalid={errors[name] ? "true" : "false"}
            />
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};