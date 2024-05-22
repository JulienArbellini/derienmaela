import React from 'react';

const LoadingOverlay = () => {
    return (
        <div id="loading-overlay" className="flex justify-center items-center flex-col">
            <div className="loader"></div>
            <div className="loader-message">Traitement en cours, veuillez patienter...</div>
        </div>
    );
};

export default LoadingOverlay;
