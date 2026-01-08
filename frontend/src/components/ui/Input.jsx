import React from 'react';

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full pl-6 pr-4 py-4 bg-[#2D3748] border border-[#4A5568] rounded-lg text-[#E2E8F0] placeholder-[#718096] focus:outline-none focus:ring-2 focus:ring-[#3182CE] text-lg transition-all ${className}`}
    {...props}
  />
);
export default Input;