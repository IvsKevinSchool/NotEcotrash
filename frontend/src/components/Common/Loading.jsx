const Loading = ({ size = 'medium', fullScreen = false, className = '' }) => {
    const sizeClasses = {
        small: 'h-8 w-8 border-t-2 border-b-2',
        medium: 'h-12 w-12 border-t-2 border-b-2',
        large: 'h-16 w-16 border-t-4 border-b-4',
    };

    return (
        <div
            className={`flex justify-center items-center ${fullScreen ? 'min-h-screen' : ''
                } ${className}`}
        >
            <div
                className={`animate-spin rounded-full border-green-500 ${sizeClasses[size]}`}
            ></div>
        </div>
    );
};

export default Loading;