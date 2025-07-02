import { HandleFormChange } from "../../types";

interface FormTextareaProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: HandleFormChange;
    rows?: number;
    placeholder?: string;
}

export const FormTextarea = ({
    id,
    name,
    label,
    value,
    onChange,
    rows = 3,
    placeholder = ""
}: FormTextareaProps) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-green-700">
            {label}
        </label>
        <textarea
            id={id}
            name={name}
            rows={rows}
            className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    </div>
);