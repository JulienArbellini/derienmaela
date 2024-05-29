import { useState, useEffect } from 'react';
import Toast, { notify } from '../components/Toast';
import LoadingOverlay from '../components/LoadingOverlay';
import FileUpload from '../components/FileUpload';
import Preview from '../components/Preview';
import ExtractedInfo from '../components/ExtractedInfo';
import { uploadFile } from '../utils/api';
import { readFileAsDataURL } from '../utils/file';
import '../styles/globals.css';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [structuredData, setStructuredData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    if (file) {
      readFileAsDataURL(file).then(setPreview).catch(console.error);

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
    try {
      setLoading(true);
      const structuredData = await uploadFile(file);
      setStructuredData(structuredData);
      setError('');
    } catch (err) {
      console.error('Error uploading file:', err);
      const errorMessage = err.response?.data?.error || 'Une erreur est survenue lors du téléversement du fichier.';
      setError(errorMessage);
      notify(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const tableText = Object.values(structuredData).join('\t');
    navigator.clipboard.writeText(tableText).then(() => {
      notify('Le contenu a été copié dans le presse-papiers.', 'success');
    }).catch(err => {
      console.error('Erreur lors de la copie dans le presse-papiers : ', err);
      notify('Erreur lors de la copie dans le presse-papiers.', 'error');
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
      <h1 className="text-4xl font-bold mb-4 text-center text-base-content">Drag and drop ta facture ici 👇</h1>
      <FileUpload handleFileChange={handleFileChange} />
      {loading && <LoadingOverlay />}
      {preview && (
        <div className="content-container mt-6 flex flex-col lg:flex-row lg:justify-between">
          <Preview file={file} preview={preview} pdfData={pdfData} />
          <ExtractedInfo structuredData={structuredData} handleInputChange={handleInputChange} handleCopy={handleCopy} />
        </div>
      )}
      <Toast />
      {error && <div className="text-error mt-4">Erreur : {error}</div>}
    </div>
  );
}
