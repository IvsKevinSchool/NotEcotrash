import { FiLoader } from 'react-icons/fi';

interface SpinnerProps {
    className?: string;
}

export function Spinner({ className }: SpinnerProps) {
    return (
        <FiLoader className={`animate-spin ${className || ''}`} />
    );
}