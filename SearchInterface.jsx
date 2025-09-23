import React, { useState } from 'react';
import { Search, Clock, Filter } from 'lucide-react';

const SearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleQuickQuery = (quickQuery) => {
    setQuery(quickQuery);
    onSearch(quickQuery);
  };

  return (
    <div className="bg-[#1A202C] border border-[#2D3748] rounded-lg p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#F7FAFC] mb-2 flex items-center justify-center gap-2">
          <Search className="text-[#3182CE]" size={28} />
          Your digital case assistant
        </h2>
        <p className="text-[#A0AEC0] text-lg">
          Search the evidence: Calls, chats, locations, and more
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all calls made from downtown area during the incident timeframe..."
            className="w-full pl-12 pr-32 py-4 bg-[#2D3748] border border-[#4A5568] rounded-lg
                     text-[#E2E8F0] placeholder-[#718096] focus:outline-none focus:ring-2
                     focus:ring-[#3182CE] focus:border-transparent text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2
                     bg-[#3182CE] hover:bg-[#2C5282] disabled:bg-[#4A5568]
                     text-white px-6 py-2 rounded-md font-medium
                     transition-colors duration-200"
          >
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInterface;
