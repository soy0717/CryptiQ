import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const SearchInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Search className="text-[#3182CE]" size={28} /> Digital Case Assistant
        </h2>
        <p className="text-[#A0AEC0] text-lg">Search evidence: Calls, chats, locations...</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if(query.trim()) onSearch(query); }} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Show me calls from downtown area..."
          className="w-full pl-6 pr-32 py-4 bg-[#2D3748] border border-[#4A5568] rounded-lg text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#3182CE] text-lg"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button type="submit" variant="primary" disabled={isLoading || !query.trim()}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
export default SearchInterface;