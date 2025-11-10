import React from "react";

const FileUpload = ({ label, onFileSelect }) => {
  const handleFileChange = (e) => {
    onFileSelect(e.target.files[0]);
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <label>{label}</label>
      <br />
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
        required
      />
    </div>
  );
};

export default FileUpload;
