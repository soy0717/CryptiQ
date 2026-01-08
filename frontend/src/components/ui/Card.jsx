import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-[#1A202C] border border-[#2D3748] rounded-lg p-8 shadow-lg ${className}`}>
    {children}
  </div>
);
export default Card;