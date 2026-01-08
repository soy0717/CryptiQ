import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

const InsightsList = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="px-6 py-4 bg-[#1A365D] border-b border-[#2D3748]">
      <h4 className="text-lg font-medium text-[#F7FAFC] mb-3 flex items-center gap-2">
        <TrendingUp size={20} className="text-[#3182CE]" /> Key Insights
      </h4>
      <div className="space-y-2">
        {insights.map((text, i) => (
          <div key={i} className="flex items-start gap-2">
            <AlertCircle size={16} className="text-[#63B3ED] mt-0.5 flex-shrink-0" />
            <span className="text-[#CBD5E0] text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default InsightsList;