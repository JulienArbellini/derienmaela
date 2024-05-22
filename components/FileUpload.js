import React from 'react';

const FileUpload = ({ handleFileChange }) => {
    return (
        <div className="upload-area border-dashed border-2 border-blue-500 p-6 rounded-lg text-center cursor-pointer" onClick={() => document.getElementById('file-input').click()}>
            <input type="file" id="file-input" onChange={handleFileChange} style={{ display: 'none' }} />
            <p>Click or Drag and Drop your invoice here</p>
        </div>
    );
};

export default FileUpload;
