const LoadingOverlay = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
        <p className="text-base-content text-lg">Traitement en cours, veuillez patienter...</p>
      </div>
    </div>
  );
  
  export default LoadingOverlay;
  