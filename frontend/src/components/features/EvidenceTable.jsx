import React from 'react';
import { Clock, Phone, MessageSquare, Video, ArrowUpRight, ArrowDownLeft, MapPin } from 'lucide-react';

const EvidenceTable = ({ logs }) => {
  if (!logs || logs.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'SMS': return <MessageSquare size={16} className="text-[#38A169]" />;
      case 'Video Call': return <Video size={16} className="text-[#805AD5]" />;
      default: return <Phone size={16} className="text-[#3182CE]" />;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#2D3748]">
          <tr>
            {['Timestamp', 'Type', 'Details', 'Duration', 'Location'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#A0AEC0] uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2D3748]">
          {logs.map((log, i) => (
            <tr key={i} className="hover:bg-[#2D3748] transition-colors">
              <td className="px-6 py-4 text-sm text-[#E2E8F0] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-[#718096]" />
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getIcon(log.callType)}
                  <span className="text-sm text-[#E2E8F0]">{log.callType}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-sm text-[#E2E8F0]">
                  {log.direction === 'Outgoing' ? <ArrowUpRight size={14} className="text-[#F56565]" /> : <ArrowDownLeft size={14} className="text-[#38A169]" />}
                  <span className="font-medium">{log.direction === 'Outgoing' ? `To: ${log.toNumber}` : `From: ${log.fromNumber}`}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-[#E2E8F0] font-mono">{log.duration_seconds || 'N/A'}s</td>
              <td className="px-6 py-4 text-sm text-[#A0AEC0]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#718096]" /> {log.location}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default EvidenceTable;