import React from 'react';
import logo from '../assets/logo-navaa.png';
import { supabase } from '../supabaseClient';

// Header.tsx
// Displays the main navigation bar, logo, and handles user logout.
// Receives onLogout prop to notify parent on user logout.
interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <header className="w-full bg-[#f5f8fa]">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 bg-[#f5f8fa]">
        <div className="flex items-center gap-2">
  <img src={logo} alt="navaa.ai Logo" className="h-20 w-20 object-contain" />
</div>
        <ul className="flex gap-6 items-center">
          <li><a href="#" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Home</a></li>
          <li><a href="#warum" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Warum navaa?</a></li>
          <li><a href="#happy-customers" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">Happy customers</a></li>
          <li><a href="#so-funktionierts" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">So funktioniert's</a></li>

          <li>
            <button
              onClick={handleLogout}
              className="ml-6 px-5 py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      {/* Hero Banner */}
      {/* Der HeroBanner ist jetzt eine eigene Komponente und sollte in App.tsx eingebunden werden. */}
    </header>
  );
}
