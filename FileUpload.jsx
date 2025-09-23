// import React, { useRef, useState } from 'react';
// import { Upload, FileText, X } from 'lucide-react';

// const FileUpload = ({ onFileUpload }) => {
//   const [dragActive, setDragActive] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const inputRef = useRef(null);

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const handleChange = (e) => {
//     e.preventDefault();
//     if (e.target.files && e.target.files[0]) {
//       handleFile(e.target.files[0]);
//     }
//   };

//   const handleFile = (file) => {
//     const allowedExtensions = ['.zip', '.ufdr', '.xml', '.json', '.csv'];
//     const fileName = file.name.toLowerCase();

//     if (allowedExtensions.some(ext => fileName.endsWith(ext))) {
//       setUploadedFile(file);
//       onFileUpload(file);
//     } 
//     else {
//       alert('Please upload a valid UFDR or forensic data file (.zip, .ufdr, .xml, .json, .csv)');
//     }
//   };

//   const removeFile = () => {
//     setUploadedFile(null);
//     onFileUpload(null);
//     if (inputRef.current) {
//       inputRef.current.value = '';
//     }
//   };

//   const onButtonClick = () => {
//     inputRef.current?.click();
//   };

//   const handleFileUpload = (file) => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);

//     fetch("http://localhost:8000/upload_ufdr", {
//       method: "POST",
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(data => {
//         alert(data.message || "Upload complete");
//         // Optionally reload / refresh data here
//       })
//       .catch(err => alert("Upload failed"));
//   };


//   return (
//     <div className="file-upload-container">
//       <h3 className="file-upload-title">
//         <Upload className="file-upload-icon" />
//         Upload UFDR Data File
//       </h3>
      
//       {!uploadedFile ? (
//         <div
//           className={`file-upload-area ${dragActive ? 'active' : ''}`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <div className="file-upload-content">
//             <Upload className="file-upload-large-icon" />
//             <p className="file-upload-text">
//               Drag and drop your UFDR file here, or
//             </p>
//             <button
//               type="button"
//               className="file-upload-button"
//               onClick={onButtonClick}
//             >
//               Browse Files
//             </button>
//             <p className="file-upload-subtext">
//               {/* CHANGE 1: Updated the descriptive text to include .zip */}
//               Supports .zip, .ufdr, .xml, and other forensic data formats
//             </p>
//           </div>
//           <input
//             ref={inputRef}
//             type="file"
//             className="file-upload-input"
//             // CHANGE 2: Added .zip to the accept attribute
//             accept=".ufdr"
//             onChange={handleChange}
//           />
//         </div>
//       ) : (
//         <div className="file-upload-success">
//           <div className="file-info">
//             <FileText className="file-icon" />
//             <div className="file-details">
//               <span className="file-name">{uploadedFile.name}</span>
//               <span className="file-size">
//                 {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//               </span>
//             </div>
//           </div>
//           <button
//             type="button"
//             className="file-remove-button"
//             onClick={removeFile}
//           >
//             <X className="remove-icon" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;



import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const allowedExtensions = ['.zip', '.ufdr', '.xml', '.json', '.csv'];
    const fileName = file.name.toLowerCase();

    if (allowedExtensions.some(ext => fileName.endsWith(ext))) {
      setUploadedFile(file);
      handleFileUpload(file);
    } else {
      alert('Please upload a valid UFDR or forensic data file (.zip, .ufdr, .xml, .json, .csv)');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onFileUpload(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:8000/upload_ufdr", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Upload complete");
        // Pass uploaded file and extracted files list back to parent
        onFileUpload(file, data.extracted_files || []);
      })
      .catch(err => alert("Upload failed"));
  };

  return (
    <div className="file-upload-container">
      <h3 className="file-upload-title">
        <Upload className="file-upload-icon" />
        Upload UFDR Data File
      </h3>
      
      {!uploadedFile ? (
        <div
          className={`file-upload-area ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="file-upload-content">
            <Upload className="file-upload-large-icon" />
            <p className="file-upload-text">
              Drag and drop your UFDR file here, or
            </p>
            <button
              type="button"
              className="file-upload-button"
              onClick={onButtonClick}
            >
              Browse Files
            </button>
            <p className="file-upload-subtext">
              Supports .zip, .ufdr, .xml, and other forensic data formats
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="file-upload-input"
            accept=".ufdr"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="file-upload-success">
          <div className="file-info">
            <FileText className="file-icon" />
            <div className="file-details">
              <span className="file-name">{uploadedFile.name}</span>
              <span className="file-size">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            className="file-remove-button"
            onClick={removeFile}
          >
            <X className="remove-icon" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
