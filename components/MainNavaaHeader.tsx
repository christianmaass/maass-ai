import React from 'react';

interface MainNavaaHeaderProps {
  onLogout: () => void;
}

const MainNavaaHeader: React.FC<MainNavaaHeaderProps> = ({ onLogout }) => {
  return (
    <header className="w-full bg-[#f5f8fa]">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 bg-[#f5f8fa]">
        <div className="flex items-center gap-2">
          <img src="/logo-navaa.png" alt="navaa.ai Logo" className="h-20 w-20 object-contain" />
        </div>
        <ul className="flex gap-6 items-center">
          <li>
            <a href="#trainer" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">navaa Trainer</a>
          </li>
          <li>
            <a href="#progress" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Dein Fortschritt</a>
          </li>
          <li>
            <a href="#user" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">User</a>
          </li>
          <li>
            <button
              onClick={onLogout}
              className="ml-6 px-5 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavaaHeader;
