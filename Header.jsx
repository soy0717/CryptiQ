import React from 'react';
import { Shield, Database } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#161B22] border-b border-[#21262D] shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="text-[#3182CE]" size={32} />
            <Database className="text-[#38A169]" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#F0F6FC]">
              UFDR Analysis Tool
            </h1>
            <p className="text-[#8B949E] text-sm">
              AI-Powered Digital Forensics Evidence Analysis
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
