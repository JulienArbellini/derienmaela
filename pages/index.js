import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';

export default function Home() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [structuredData, setStructuredData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            handleUpload(file);
        }
    }, [file]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStructuredData(response.data.structured_data);
            setError('');
        } catch (err) {
            console.error('Error uploading file:', err);
            setError(err.response?.data?.error || 'An error occurred while uploading the file.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const tableText = Object.values(structuredData).join('\t');
        navigator.clipboard.writeText(tableText).then(() => {
            alert('Le contenu a été copié dans le presse-papiers.');
        }).catch(err => {
            console.error('Erreur lors de la copie dans le presse-papiers : ', err);
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStructuredData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Drag and drop ta facture ici 👇</h1>
            <div className="upload-area border-dashed border-2 border-blue-500 p-6 rounded-lg text-center cursor-pointer" onClick={() => document.getElementById('file-input').click()}>
                <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
                <p>Click or Drag and Drop your invoice here</p>
            </div>
            {loading && (
                <div id="loading-overlay" className="flex justify-center items-center flex-col">
                    <div className="loader"></div>
                    <div className="loader-message">Traitement en cours, veuillez patienter...</div>
                </div>
            )}
            {preview && (
                <div className="content-container mt-6 flex">
                    <div className="preview-section w-1/2">
                        <h2 className="text-lg font-semibold mb-2">Invoice Preview</h2>
                        <div className="invoice-preview border p-4 rounded">
                            <img src={preview} alt="Invoice Preview" className="max-w-full h-auto" />
                        </div>
                    </div>
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
                </div>
            )}
            {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </div>
    );
}
