const ExtractedInfo = ({ structuredData, handleInputChange, handleCopy }) => {
    if (!structuredData || Object.keys(structuredData).length === 0) {
      return null; // Return nothing if there's no data
    }
  
    return (
      <div className="w-full lg:w-1/2 lg:pl-4 h-[70%] max-h-[70%]">
        <h2 className="text-lg font-semibold mb-2">Informations extraites :</h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg bg-base-100 h-full max-h-screen">
          <div className="overflow-y-auto h-full">
            <table className="table w-full">
              <thead className="bg-base-200 sticky top-0">
                <tr>
                  <th className="py-3 px-4 text-sm font-normal text-left text-base-content">Champ</th>
                  <th className="py-3 px-4 text-sm font-normal text-left text-base-content">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(structuredData).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-4 py-4 text-sm font-medium text-base-content">{key}</td>
                    <td className="px-4 py-4 text-sm text-base-content">
                      <input
                        className="input input-bordered w-full"
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={handleCopy}>Copier</button>
        </div>
      </div>
    );
  };
  
  export default ExtractedInfo;
  