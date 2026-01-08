import React from 'react';
import Header from './Header';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-[#0D1117] text-[#F0F6FC] font-sans">
    <Header />
    <main className="max-w-[1200px] mx-auto px-8 py-12 flex flex-col gap-12">
      {children}
    </main>
  </div>
);
export default Layout;