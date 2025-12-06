import React from 'react';

const LoadingSpinner = () => {
    return (
        <div>
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;