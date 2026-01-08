import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: "bg-[#3182CE] hover:bg-[#2C5282] text-white",
    success: "bg-[#38A169] hover:bg-[#2F855A] text-white",
    danger:  "bg-transparent text-[#F56565] hover:bg-red-900/10",
    outline: "border border-[#4A5568] text-[#E2E8F0] hover:bg-[#4A5568]"
  };

  return (
    <button 
      className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;