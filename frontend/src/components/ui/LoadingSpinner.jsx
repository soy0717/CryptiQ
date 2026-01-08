import React from 'react';

const LoadingSpinner = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center space-x-3">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3182CE]"></div>
    <span className="text-[#A0AEC0] text-lg">{text}</span>
  </div>
);
export default LoadingSpinner;