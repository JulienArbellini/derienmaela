const FileUpload = ({ handleFileChange }) => {
    return (
      <div className="w-full flex flex-col items-center p-6 border-2 border-dashed border-primary rounded-lg cursor-pointer" onClick={() => document.getElementById('file-input').click()}>
        <input type="file" id="file-input" onChange={handleFileChange} className="hidden" />
        <p className="text-primary">Click or Drag and Drop your invoice here</p>
      </div>
    );
  };
  
  export default FileUpload;
  