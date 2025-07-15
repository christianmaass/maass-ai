import React from 'react';

export default function Header() {
  return (
    <header className="w-full bg-blue-700 text-white shadow mb-8">
      <nav className="max-w-4xl mx-auto flex justify-between items-center py-4 px-6">
        <div className="font-bold text-xl">maass-ai-starter</div>
        <ul className="flex gap-6">
          <li><a href="#" className="hover:underline">Menü 1</a></li>
          <li><a href="#" className="hover:underline">Menü 2</a></li>
          <li><a href="#" className="hover:underline">Menü 3</a></li>
          <li><a href="#" className="hover:underline">Menü 4</a></li>
        </ul>
      </nav>
    </header>
  );
}
