import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import FileUpload from '../components/FileUpload';
import LoadingOverlay from '../components/LoadingOverlay';
import Preview from '../components/Preview';
import ExtractedInfo from '../components/ExtractedInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [structuredData, setStructuredData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            handleUpload(file);
            if (file.type === 'application/pdf') {
                setPdfData(URL.createObjectURL(file));
            }
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
            toast.success('Données extraites avec succès!');
        } catch (err) {
            console.error('Error uploading file:', err);
            toast.error('Erreur lors de l\'extraction des données.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const tableText = Object.values(structuredData).join('\t');
        navigator.clipboard.writeText(tableText).then(() => {
            toast.success('Le contenu a été copié dans le presse-papiers.');
        }).catch(err => {
            console.error('Erreur lors de la copie dans le presse-papiers : ', err);
            toast.error('Erreur lors de la copie dans le presse-papiers.');
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
            <ToastContainer />
            <h1 className="text-4xl font-bold mb-4">Drag and drop ta facture ici 👇</h1>
            <div className="upload-area border-dashed border-2 border-blue-500 p-6 rounded-lg text-center cursor-pointer" onClick={() => document.getElementById('file-input').click()}>
                <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
                <p>Click or Drag and Drop your invoice here</p>
            </div>
            {loading && (
                <LoadingOverlay />
            )}
            {preview && (
                <div className="content-container mt-6 flex">
                    <div className="preview-section w-1/2">
                        <h2 className="text-lg font-semibold mb-2">Invoice Preview</h2>
                        <div className="invoice-preview border p-4 rounded">
                            {file.type === 'application/pdf' ? (
                                <canvas id="pdf-preview"></canvas>
                            ) : (
                                <img src={preview} alt="Invoice Preview" className="max-w-full h-auto" />
                            )}
                        </div>
                    </div>
                    <ExtractedInfo structuredData={structuredData} handleInputChange={handleInputChange} handleCopy={handleCopy} />
                </div>
            )}
            {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        </div>
    );
}
