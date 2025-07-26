import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import AuthModal from './AuthModal';

interface UnifiedHeaderProps {
  variant?: 'marketing' | 'app';
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ variant = 'marketing' }) => {
  const { user, logout, loading } = useAuth();
  const { profile, isAdmin } = useProfile();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLogout = async () => {
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

  const openRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  return (
    <header className="w-full bg-[#fcfdfe] sticky top-0 z-50 border-b border-gray-100">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
      
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo-navaa.png" alt="navaa.ai Logo" className="h-20 w-20 object-contain" />
          </a>
        </div>

        {/* Navigation */}
        <ul className="flex gap-6 items-center">
          {user ? (
            // App Navigation für eingeloggte User
            <>
              <li>
                <a href="/" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/cases" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Cases
                </a>
              </li>
              <li>
                <a href="/preise" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Preise
                </a>
              </li>
              {isAdmin && (
                <li>
                  <a href="/admin" className="text-red-600 font-medium hover:text-red-800 transition-colors font-sans">
                    Admin
                  </a>
                </li>
              )}
              <li>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Hallo, {profile?.name || user.email}!
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-[#00bfae] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#009688] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Wird abgemeldet...' : 'Abmelden'}
                  </button>
                </div>
              </li>
            </>
          ) : (
            // Marketing Navigation für Gäste
            <>
              <li>
                <a href="#features" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Warum navaa?
                </a>
              </li>
              <li>
                <a href="#audience" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Für wen?
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  So funktioniert es
                </a>
              </li>
              <li>
                <a href="/preise" className="text-gray-800 font-medium hover:text-gray-600 transition-colors font-sans">
                  Preise
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openLogin}
                    className="px-4 py-2 text-[#00bfae] border border-[#00bfae] rounded-lg font-semibold hover:bg-[#00bfae] hover:text-white transition-colors"
                  >
                    Anmelden
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-4 py-2 bg-[#00bfae] text-white rounded-lg font-semibold hover:bg-[#009688] transition-colors"
                  >
                    Registrieren
                  </button>
                </div>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default UnifiedHeader;
