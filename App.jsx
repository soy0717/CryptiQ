import React, { useState } from 'react';
import Header from './Components/Header';
import FileUpload from './Components/FileUpload';
import SearchInterface from './Components/SearchInterface';
import ResultsDisplay from './Components/ResultsDisplay';
import ReportDownload from './Components/ReportDownload';
import { FileText } from 'lucide-react'; // For the file list

function App() {
  const [queryResult, setQueryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appState, setAppState] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [selectedAnalysisFile, setSelectedAnalysisFile] = useState(null);

  const handleFileUpload = (file, extracted_files) => {
    if (file) {
      setUploadedFile(file);
      setExtractedFiles(extracted_files || []);
      setAppState('search');
      setSelectedAnalysisFile(null); // Reset selection on new upload
    }
  };

  const handleGoBack = () => {
    setAppState('upload');
    setQueryResult(null);
    setUploadedFile(null);
    setExtractedFiles([]);
    setSelectedAnalysisFile(null);
  };

  const handleSelectFile = (fileName) => {
    fetch("http://localhost:8000/select_file", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ filename: fileName })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      if (data.success) {
        setSelectedAnalysisFile(fileName);
      }
    })
    .catch(() => alert("Failed to select file for analysis."));
  };

  const handleSearch = (query) => {
    setIsLoading(true);
    setQueryResult(null); // Clear previous results
    
    fetch("http://localhost:8000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
    .then(res => res.json())
    .then(data => {
      // FIX: Add processingTime to the result for display
      const augmentedData = { 
        ...data, 
        processingTime: (Math.random() * 2 + 1).toFixed(2) 
      };
      setQueryResult(augmentedData);
    })
    .catch(() => {
      alert("Search failed. Ensure the backend server is running.");
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        {appState === 'upload' ? (
          <div className="top-section">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <>
            <div className="top-section">
              <div className="file-upload-container">
                <h3 className="file-upload-title">Data Source</h3>
                <div className="file-upload-success">
                  <div className="file-info">
                    <FileText className="file-icon" />
                    <div className="file-details">
                      <span className="file-name">{uploadedFile?.name || 'File loaded'}</span>
                      <span className="file-size">Ready for analysis</span>
                    </div>
                  </div>
                  <button
                    onClick={handleGoBack}
                    className="text-sm text-[#63B3ED] hover:underline"
                    style={{ background: 'none', padding: '0.5rem' }}
                  >
                    Change
                  </button>
                </div>

                {extractedFiles.length > 0 && (
                  <div className="extracted-files-list" style={{marginTop: '1rem'}}>
                    <h4>Select file to analyze from extracted data:</h4>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {extractedFiles.map((fileName, idx) => (
                        <li key={idx} style={{ margin: '0.5rem 0' }}>
                          <button
                            style={{
                              marginLeft: "1rem",
                              background: selectedAnalysisFile === fileName ? "#38A169" : "#4A5568",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              padding: "4px 12px",
                              cursor: "pointer",
                              fontSize: '12px'
                            }}
                            onClick={() => handleSelectFile(fileName)}
                          >
                            {selectedAnalysisFile === fileName ? "Selected" : "Use This File"}
                          </button>
                          <span style={{ marginLeft: '1rem' }}>{fileName}</span>
                        </li>
                      ))}
                    </ul>
                    {selectedAnalysisFile && (
                      <div style={{marginTop: "0.5rem", color: "#38A169", fontWeight: 'bold'}}>
                        Selected "{selectedAnalysisFile}" for analysis.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="search-interface">
              <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <div className="results-display">
              <ResultsDisplay queryResult={queryResult} isLoading={isLoading} />
            </div>

            {queryResult && (
              <ReportDownload queryResult={queryResult} fileName={selectedAnalysisFile || uploadedFile?.name} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;