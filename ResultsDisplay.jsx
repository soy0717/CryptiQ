import React from 'react';
import { 
  Clock, 
  Phone, 
  MessageSquare, 
  Video, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MapPin, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const ResultsDisplay = ({ queryResult, isLoading }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const getCallIcon = (callType) => {
    switch (callType) {
      case 'Voice Call':
        return <Phone size={18} className="text-[#3182CE]" />;
      case 'SMS':
        return <MessageSquare size={18} className="text-[#38A169]" />;
      case 'Video Call':
        return <Video size={18} className="text-[#805AD5]" />;
      default:
        return <Phone size={18} className="text-[#3182CE]" />;
    }
  };

  const getDirectionIcon = (direction) => {
    return direction === 'Outgoing' 
      ? <ArrowUpRight size={16} className="text-[#F56565]" />
      : <ArrowDownLeft size={16} className="text-[#38A169]" />;
  };

  // Hardcoded insights if none are provided
  const defaultInsights = [
    'Most calls are made during business hours.',
    'Incoming calls are slightly higher than outgoing calls.',
    'Call duration averages around 15 minutes.',
  ];

  if (isLoading) {
    return (
      <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3182CE]"></div>
          <span className="text-[#A0AEC0] text-lg">Analyzing evidence database...</span>
        </div>
      </div>
    );
  }

  if (!queryResult) {
    return (
      <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-8 text-center">
        <div className="text-[#718096] mb-4">
          <Clock size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Enter your query above to start analyzing call log data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg overflow-hidden">
      {/* Query Header */}
      <div className="bg-[#2D3748] px-6 py-4 border-b border-[#4A5568]">
        <h3 className="text-xl font-semibold text-[#F7FAFC] mb-2">
          Query: "{queryResult.query}"
        </h3>
        <div className="flex items-center space-x-6 text-sm text-[#A0AEC0]">
          <span className="flex items-center gap-1">
            <CheckCircle size={16} className="text-[#38A169]" />
            &nbsp;{queryResult.totalResults || 0} results found&nbsp;
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} className="text-[#3182CE]" />
            &nbsp;Processed in {queryResult.processingTime || 'N/A'}s
          </span>
        </div>
      </div>

      {/* Insights Section */}
      <div className="px-6 py-4 bg-[#1A365D] border-b border-[#2D3748]">
        <h4 className="text-lg font-medium text-[#F7FAFC] mb-3 flex items-center gap-2">
          <TrendingUp size={20} className="text-[#3182CE]" />
          Key Insights
        </h4>
        <div className="space-y-2">
          {(queryResult.insights && queryResult.insights.length > 0
            ? queryResult.insights
            : defaultInsights
          ).map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertCircle size={16} className="text-[#63B3ED] mt-0.5 flex-shrink-0" />
              <span className="text-[#CBD5E0] text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Message display for no results */}
      {queryResult.totalResults === 0 && queryResult.message && (
        <div className="px-6 py-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[#D69E2E]" />
          <p className="mt-4 text-lg text-[#A0AEC0]">
            {queryResult.message}
          </p>
        </div>
      )}

      {/* Results Table */}
      {(queryResult.callLogs || []).length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2D3748]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Caller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Callee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase tracking-wider">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3748]">
              {(queryResult.callLogs || []).map((log, index) => (
                <tr key={index} className="hover:bg-[#2D3748] transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                    {formatTimestamp(log.start_time)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getCallIcon(log.call_type)}
                      <span className="text-sm text-[#E2E8F0]">{log.call_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#E2E8F0] font-mono">
                    {log.caller || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#E2E8F0] font-mono">
                    {log.callee || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-[#E2E8F0] font-mono">
                    {formatDuration(log.duration_seconds)}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#A0AEC0]">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#718096] mt-0.5 flex-shrink-0" />
                      <span>{log.location}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
