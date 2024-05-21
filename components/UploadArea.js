import React, { useRef } from 'react';

const UploadArea = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) {
      onFileSelect({ target: { files: [file] } });
    }
  };

  return (
    <div
      className="upload-area"
      onClick={() => fileInputRef.current.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <p>Click or Drag and Drop your invoice here</p>
    </div>
  );
};

export default UploadArea;
