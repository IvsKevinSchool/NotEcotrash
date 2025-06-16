import React from "react";

const BackButton: React.FC = () => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
        >
            Volver
        </button>
    );
}

export default BackButton;