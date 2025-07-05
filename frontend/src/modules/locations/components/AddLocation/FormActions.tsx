interface FormActionsProps {
    isSubmitting: boolean;
    submitText: string;
    onCancel?: () => void; // Hacerlo opcional
    cancelText?: string;   // Hacerlo opcional
}

export const FormActions = ({
    isSubmitting,
    submitText,
    onCancel,
    cancelText = "Cancelar" // Valor por defecto
}: FormActionsProps) => (
    <div className="flex justify-end gap-4 mt-8">
        {onCancel && (
            <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
                {cancelText}
            </button>
        )}
        <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
            {isSubmitting ? "Enviando..." : submitText}
        </button>
    </div>
);