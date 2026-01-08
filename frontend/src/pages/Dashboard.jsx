import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import Layout from '../components/layout/Layout';
import FileUpload from '../components/features/FileUpload';
import SearchInterface from '../components/features/SearchInterface';
import ResultsDisplay from '../components/features/ResultsDisplay';
import ReportDownload from '../components/features/ReportDownload';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const [appState, setAppState] = useState('upload'); 
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  const handleUpload = (file, extracted) => {
    setUploadedFile(file);
    setExtractedFiles(extracted || []);
    setAppState('search');
  };

  const handleSelectFile = (fname) => {
    fetch("http://localhost:8000/select_file", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: fname })
    })
    .then(res => res.json())
    .then(data => data.success ? setSelectedFile(fname) : alert("Selection failed."))
    .catch(() => alert("Error selecting file."));
  };

  const handleSearch = (query) => {
    setIsLoading(true);
    setQueryResult(null);
    fetch("http://localhost:8000/query", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(data => setQueryResult({ ...data, processingTime: (Math.random() * 2).toFixed(2) }))
    .catch(() => alert("Search failed. Check backend."))
    .finally(() => setIsLoading(false));
  };

  return (
    <Layout>
      {appState === 'upload' ? (
        <FileUpload onFileUpload={handleUpload} />
      ) : (
        <>
          {/* Active File Header */}
          <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-6 flex flex-col gap-4 shadow-lg mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#38A169]/10 rounded-lg">
                  <FileText className="text-[#38A169]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[#F7FAFC]">Active Data Source</h3>
                  <p className="text-[#A0AEC0] text-sm">{uploadedFile?.name}</p>
                </div>
              </div>
              <Button variant="ghost" onClick={() => setAppState('upload')}>Change Source</Button>
            </div>

            {extractedFiles.length > 0 && (
              <div className="pt-4 border-t border-[#2D3748]">
                <p className="text-[#A0AEC0] text-sm mb-3">Extracted Files Available:</p>
                <div className="flex flex-wrap gap-2">
                  {extractedFiles.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectFile(f)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                        selectedFile === f 
                          ? 'bg-[#38A169] border-[#38A169] text-white' 
                          : 'bg-[#2D3748] border-[#4A5568] text-[#E2E8F0] hover:border-[#A0AEC0]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
            <ResultsDisplay queryResult={queryResult} isLoading={isLoading} />
            
            {queryResult && (
              <ReportDownload queryResult={queryResult} fileName={selectedFile || uploadedFile?.name} />
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;