import React from "react";

// FormTextarea.tsx
interface FormTextareaProps {
    id: string;
    label: string;
    error?: { message?: string };
    placeholder?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ id, label, error, ...props }, ref) => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-green-700">
                {label}
            </label>
            <textarea
                id={id}
                ref={ref}
                className={`w-full px-4 py-2 border ${error ? "border-red-300" : "border-green-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    )
);