import React from 'react';

const ExtractedInfo = ({ structuredData, handleInputChange, handleCopy }) => {
    if (!structuredData || Object.keys(structuredData).length === 0) {
        return null; // Return nothing if there's no data
    }

    return (
        <div className="extracted-info-container w-1/2 pl-4">
            <h2 className="text-lg font-semibold mb-2">Informations extraites :</h2>
            <div className="content">
                <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 ">Champ</th>
                                <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 ">Valeur</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Object.entries(structuredData).map(([key, value]) => (
                                <tr key={key}>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-700  whitespace-nowrap">{key}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500  whitespace-nowrap">
                                        <div className="relative h-10 w-full min-w-[200px]">
                                            <input
                                                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                                placeholder=" "
                                                type="text"
                                                name={key}
                                                value={value}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="buttons-container mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCopy}>Copier</button>
                </div>
            </div>
        </div>
    );
};

export default ExtractedInfo;
