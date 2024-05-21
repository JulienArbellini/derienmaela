import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';

export default function Home() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [structuredData, setStructuredData] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Nouvel état pour le chargement

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
            setLoading(true); // Afficher la roue de chargement
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
            setLoading(false); // Masquer la roue de chargement
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

    return (
        <div className="container">
            <h1>Drag and drop ta facture ici 👇</h1>
            <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
                <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
                <p>Click or Drag and Drop your invoice here</p>
            </div>
            {loading && (
                <div id="loading-overlay">
                    <div className="loader"></div>
                    <div className="loader-message">Traitement en cours, veuillez patienter...</div>
                </div>
            )}
            {preview && (
                <div className="content-container">
                    <div className="preview-section">
                        <h2>Invoice Preview</h2>
                        <div className="invoice-preview">
                            <img src={preview} alt="Invoice Preview" />
                        </div>
                    </div>
                    <div className="extracted-info-container">
                        <h2>Informations extraites :</h2>
                        <div className="content">
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Champ</th>
                                        <th>Valeur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(structuredData).map(([key, value]) => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="buttons-container">
                                <button onClick={handleCopy}>Copier</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && <div>Error: {error}</div>}
        </div>
    );
}
