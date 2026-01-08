import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import Button from '../ui/Button'; // Importing from UI
import Card from '../ui/Card';     // Importing from UI

const ALLOWED_EXTS = ['.zip', '.ufdr', '.xml', '.json', '.csv', '.xlsx', '.xls', '.txt'];

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const inputRef = useRef(null);

  const validateAndUpload = (file) => {
    if (ALLOWED_EXTS.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setUploadedFile(file);
      const formData = new FormData();
      formData.append("file", file);

      // Backend Connection
      fetch("http://localhost:8000/upload_ufdr", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
          alert(data.message || "Upload complete");
          onFileUpload(file, data.extracted_files || []);
        })
        .catch(() => {
          alert("Upload failed. Ensure backend is running.");
          setUploadedFile(null);
        });
    } else {
      alert(`Invalid format. Allowed: ${ALLOWED_EXTS.join(', ')}`);
    }
  };

  return (
    <Card className="p-10">
      <h3 className="flex items-center gap-3 text-xl font-semibold mb-8 text-[#F7FAFC]">
        <Upload className="text-[#3182CE]" /> Upload Evidence Data
      </h3>
      
      {!uploadedFile ? (
        <div 
          className={`border-2 dashed rounded-xl p-14 text-center transition-all cursor-pointer relative
            ${dragActive ? 'border-[#3182CE] bg-blue-900/10' : 'border-[#4A5568]'}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) validateAndUpload(e.dataTransfer.files[0]); }}
        >
          <div className="flex flex-col items-center gap-6">
            <Upload className="w-14 h-14 text-[#718096]" />
            <p className="text-[#A0AEC0] text-lg">Drag & drop evidence file here</p>
            <Button variant="primary" onClick={() => inputRef.current?.click()}>Browse Files</Button>
            <p className="text-[#718096] text-sm">Supports UFDR, Zip, Excel, CSV, JSON, Text</p>
          </div>
          <input ref={inputRef} type="file" className="hidden" accept={ALLOWED_EXTS.join(',')} onChange={(e) => e.target.files[0] && validateAndUpload(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex items-center justify-between p-6 bg-green-900/10 border border-[#38A169] rounded-lg">
          <div className="flex items-center gap-4">
            <FileText className="w-7 h-7 text-[#38A169]" />
            <div>
              <span className="block font-semibold">{uploadedFile.name}</span>
              <span className="text-[#A0AEC0] text-sm">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <Button variant="danger" onClick={() => { setUploadedFile(null); onFileUpload(null); }}>
            <X size={20} />
          </Button>
        </div>
      )}
    </Card>
  );
};
export default FileUpload;