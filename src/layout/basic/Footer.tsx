import React, { useState } from 'react';
import Link from 'next/link';
import ImpressumOverlay from '@ui/ImpressumOverlay';

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
  const [showImpressum, setShowImpressum] = useState(false);

  return (
    <footer className="border-t border-gray-200 mt-auto" style={{ backgroundColor: '#ebe8e4' }}>
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Box 1 */}
          <div>
            {/* Headline */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-900 leading-tight">
                <span className="text-navaa-orange">
                  Denk nicht härter - <br />
                  denk smarter
                </span>
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              {/* navaa Logo Icon */}
              <Link href="/" className="text-gray-600 hover:text-[#009e82] transition-colors">
                <div className="w-6 h-6 flex items-center justify-center bg-gray-600 hover:bg-[#009e82] rounded text-white text-xs font-bold transition-colors">
                  n
                </div>
              </Link>
              <a
                href="https://linkedin.com/company/navaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/navaa.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="mailto:info@navaa.ai"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.749L12 10.58l9.615-6.759h.749c.904 0 1.636.732 1.636 1.636z" />
                </svg>
              </a>
            </div>
          </div>
          {/* Box 2 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">navaa für</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Privatpersonen
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Unternehmen
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Hochschulen
                </a>
              </li>
            </ul>
          </div>
          {/* Box 3 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">Lernpfade</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Consultant Track
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  PO Track
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  CFO Track
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Communicator Track
                </a>
              </li>
            </ul>
          </div>
          {/* Box 4 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">Unternehmen</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Team
                </a>
              </li>
              <li>
                <Link href="/lernansatz" className="text-[#009e82] hover:text-[#007a66]">
                  Unser Lernansatz
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          {/* Box 5 */}
          <div>
            <h4 className="text-base font-bold mb-3 text-gray-900">Rechtliches</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setShowImpressum(true)}
                  className="text-[#009e82] hover:text-[#007a66] text-left"
                >
                  Impressum
                </button>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Datenschutzerklärung
                </a>
              </li>
              <li>
                <a href="#" className="text-[#009e82] hover:text-[#007a66]">
                  Barrierefreiheitserklärung
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 font-sans pb-10">
          &copy; {new Date().getFullYear()} navaa.ai – All rights reserved.
        </div>
      </div>
      <ImpressumOverlay isOpen={showImpressum} onClose={() => setShowImpressum(false)} />
    </footer>
  );
}
