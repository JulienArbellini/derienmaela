import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';

export default function Home() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [structuredData, setStructuredData] = useState({});
    const [editableData, setEditableData] = useState({});
    const [error, setError] = useState('');

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
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setStructuredData(response.data.structured_data);
            setEditableData(response.data.structured_data); // Set editable data initially
            setError('');
        } catch (err) {
            console.error('Error uploading file:', err);
            setError(err.response?.data?.error || 'An error occurred while uploading the file.');
        }
    };

    const handleCopy = () => {
        let tableText = '';

        Object.values(editableData).forEach((value, index) => {
            tableText += `${value}`;
            if (index < Object.values(editableData).length - 1) {
                tableText += '\t'; // Ajouter une tabulation entre les valeurs pour les mettre sur une seule ligne
            }
        });

        navigator.clipboard.writeText(tableText).then(() => {
            alert('Le contenu a été copié dans le presse-papiers.');
        }).catch(err => {
            console.error('Erreur lors de la copie dans le presse-papiers : ', err);
        });
    };

    const handleInputChange = (e, key) => {
        setEditableData({
            ...editableData,
            [key]: e.target.value,
        });
    };

    const renderEditableData = (data) => {
        return Object.entries(data).map(([key, value]) => (
            <div key={key} className="input-group">
                <label>{key}:</label>
                <input 
                    type="text" 
                    value={value || ''} // Ensure the field is empty if there is no data
                    onChange={(e) => handleInputChange(e, key)} 
                />
            </div>
        ));
    };

    return (
        <div className="container">
            <h1>Drag and drop ta facture ici 👇</h1>

            <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
                <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
                <p>Click or Drag and Drop your invoice here</p>
            </div>

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
                            {renderEditableData(editableData)}
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
