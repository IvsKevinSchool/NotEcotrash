import React from 'react';

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#405D72] hover:bg-[#2b475c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Cargando...
        </span>
      ) : (
        label
      )}
    </button>
  );
};
