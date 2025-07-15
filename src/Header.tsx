import React from 'react';

import { supabase } from './supabaseClient';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <header className="w-full bg-blue-700 text-white shadow mb-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-4 px-6">
        <div className="font-bold text-xl">maass-ai-starter</div>
        <ul className="flex gap-6 items-center">
          <li><a href="#" className="hover:underline">Menü 1</a></li>
          <li><a href="#" className="hover:underline">Menü 2</a></li>
          <li><a href="#" className="hover:underline">Menü 3</a></li>
          <li><a href="#" className="hover:underline">Menü 4</a></li>
          <li>
            <button
              onClick={handleLogout}
              className="ml-6 bg-white text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
