/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ Navigation Consistency - Logo always redirects to homepage
 * ✅ Smart Routing - Let homepage handle routing logic
 * ✅ Branding - navaa colors and hover effects
 * ✅ User Experience - Clear navigation and user controls
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@contexts/AuthContext';
import { useProfile } from '@hooks/useProfile';
import AuthModal from '@ui/AuthModal';
import { BRAND_LOGO } from '@lib/assetPaths';

interface UnifiedHeaderProps {
  variant?: 'marketing' | 'app';
}

export default function UnifiedHeader({ variant: _variant = 'marketing' }: UnifiedHeaderProps) {
  const { user, logout, loading: _loading } = useAuth();
  const { profile: _profile, isAdmin } = useProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll function for navigation
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 100; // Account for sticky header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const _handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Hamburger Icon Component
  const HamburgerIcon = () => (
    <div className="flex flex-col justify-center items-center w-6 h-6 cursor-pointer">
      <span
        className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}
      ></span>
      <span
        className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
      ></span>
      <span
        className={`bg-gray-800 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}
      ></span>
    </div>
  );

  return (
    <header className="w-full bg-[#f6f4f0] sticky top-0 z-50 border-b border-gray-100">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />

      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={BRAND_LOGO}
              alt="navaa.ai Logo"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2"
          aria-label="Toggle mobile menu"
        >
          <HamburgerIcon />
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-6 items-center">
          {user ? (
            // App Navigation für eingeloggte User
            <>
              <li>
                <Link
                  href="/"
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans"
                >
                  Kurskatalog
                </Link>
              </li>
              <li>
                <Link
                  href="/app/lernfortschritt"
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans"
                >
                  Dein Lernfortschritt
                </Link>
              </li>

              {/* Methodenbaukasten (noch ohne Verlinkung) */}
              <li>
                <span className="text-gray-800 font-medium font-sans cursor-default select-none">
                  Methodenbaukasten
                </span>
              </li>

              <li>
                <Link
                  href="/app/settings?section=pricing"
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans"
                >
                  Preise
                </Link>
              </li>

              <li>
                <Link
                  href="/app/settings"
                  className="flex items-center justify-center w-10 h-10 hover:bg-primary rounded-full transition-colors group"
                  title="Benutzereinstellungen"
                >
                  <svg
                    className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              </li>
            </>
          ) : (
            // Marketing Navigation für Gäste
            <>
              <li>
                <button
                  onClick={() => scrollToSection('top')}
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('target-audience')}
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans cursor-pointer"
                >
                  Für wen
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('benefits')}
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans cursor-pointer"
                >
                  So funktioniert es
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <Link
                  href="/app/settings?section=pricing"
                  className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans"
                >
                  Preise
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <button
                    onClick={openLogin}
                    className="px-6 py-2 bg-[#009e82] text-white rounded-lg font-semibold hover:bg-[#007a66] transition-colors"
                  >
                    Anmelden
                  </button>
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-60 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        >
          <div
            className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-600 hover:text-gray-800"
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="px-6 py-4">
              {user ? (
                // Mobile App Navigation für eingeloggte User
                <nav className="space-y-4">
                  <Link
                    href="/"
                    className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Kurskatalog
                  </Link>
                  <Link
                    href="/app/lernfortschritt"
                    className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Dein Lernfortschritt
                  </Link>

                  {/* Methodenbaukasten (noch ohne Verlinkung) */}
                  <div className="py-3 px-4 text-gray-800 font-medium rounded-lg select-none">
                    Methodenbaukasten
                  </div>

                  <Link
                    href="/app/settings?section=pricing"
                    className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Preise
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block py-3 px-4 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                      onClick={toggleMobileMenu}
                    >
                      Admin
                    </Link>
                  )}

                  {/* User Settings Link */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/app/settings"
                      onClick={toggleMobileMenu}
                      className="flex items-center gap-3 w-full py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium">Benutzereinstellungen</span>
                    </Link>
                  </div>
                </nav>
              ) : (
                // Mobile Marketing Navigation für Gäste
                <nav className="space-y-4">
                  <button
                    onClick={() => {
                      scrollToSection('top');
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('target-audience');
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Für wen
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('benefits');
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    So funktioniert es
                  </button>
                  <button
                    onClick={() => {
                      scrollToSection('faq');
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    FAQs
                  </button>
                  <Link
                    href="/app/settings?section=pricing"
                    className="block py-3 px-4 text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    Preise
                  </Link>

                  {/* Auth Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        openLogin();
                        toggleMobileMenu();
                      }}
                      className="w-full py-3 px-4 bg-[#00bfae] text-white rounded-lg font-semibold hover:bg-[#009688] transition-colors"
                    >
                      Anmelden
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
