import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';
import EvidenceTable from './EvidenceTable';
import InsightsList from './InsightsList';

const ResultsDisplay = ({ queryResult, isLoading }) => {
  if (isLoading) return <Card><LoadingSpinner text="Analyzing evidence database..." /></Card>;

  if (!queryResult) {
    return (
      <Card className="text-center">
        <Clock size={48} className="mx-auto mb-4 opacity-50 text-[#718096]" />
        <p className="text-lg text-[#718096]">Enter a query to begin analysis.</p>
      </Card>
    );
  }

  return (
    <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg overflow-hidden shadow-lg">
      <div className="bg-[#2D3748] px-6 py-4 border-b border-[#4A5568] flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-semibold text-[#F7FAFC]">Query: "{queryResult.query}"</h3>
        <div className="flex gap-4 text-sm text-[#A0AEC0]">
          <span className="flex items-center gap-1"><CheckCircle size={16} className="text-[#38A169]" /> {queryResult.totalResults} results</span>
          <span className="flex items-center gap-1"><Clock size={16} className="text-[#3182CE]" /> {queryResult.processingTime}s</span>
        </div>
      </div>

      <InsightsList insights={queryResult.insights} />
      
      {queryResult.totalResults === 0 && (
        <div className="px-6 py-8 text-center text-[#A0AEC0]">
          <AlertCircle className="mx-auto h-12 w-12 text-[#D69E2E] mb-4" />
          {queryResult.message || "No records found."}
        </div>
      )}

      <EvidenceTable logs={queryResult.callLogs} />
    </div>
  );
};
export default ResultsDisplay;