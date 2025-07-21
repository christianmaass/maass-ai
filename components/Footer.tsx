import React from 'react';


// Footer.tsx
// Displays the site-wide footer with copyright and additional links.
// 
// The footer is divided into four sections:
// 1. Logo and contact information
// 2. Company links
// 3. Legal and data protection links
// 4. Links to navaa services for different use cases
// 
// The layout is responsive and adapts to different screen sizes.
export default function Footer() {
  return (
    <footer className="w-full py-12 mt-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Box 1 */}
          <div>
            <img src="/logo-navaa.png" alt="navaa.ai Logo" className="h-20 w-20 object-contain" />

            <a href="mailto:info@navaa.ai" className="text-gray-700 hover:text-gray-900 text-sm">info@navaa.ai</a>
          </div>
          {/* Box 2 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">Unternehmen</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Team</a></li>
              <li><a href="#warum" className="text-gray-700 hover:text-gray-900">Warum navaa?</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Kontakt</a></li>
            </ul>
          </div>
          {/* Box 3 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">Rechtliches</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Impressum</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Datenschutzerklärung</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Barrierefreiheitserklärung</a></li>
            </ul>
          </div>
          {/* Box 4 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">navaa für</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Privatpersonen</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Unternehmen</a></li>
              <li><a href="#" className="text-gray-700 hover:text-gray-900">Hochschulen</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 font-sans">
          &copy; {new Date().getFullYear()} navaa.ai – All rights reserved.
        </div>
      </div>
    </footer>
  );
}
