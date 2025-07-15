import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-200 py-4 mt-12">
      <div className="max-w-4xl mx-auto px-6 text-center text-sm">
        &copy; {new Date().getFullYear()} maass-ai-starter – All rights reserved.
      </div>
    </footer>
  );
}
