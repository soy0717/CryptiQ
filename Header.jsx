const Header = () => {
  return (
    <header className="bg-[#161B22] border-b border-[#21262D] shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold text-[#F0F6FC]">
              CryptiQ - UFDR Analysis Tool
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
