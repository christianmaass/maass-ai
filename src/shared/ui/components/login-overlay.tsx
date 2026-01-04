'use client';

import { useEffect } from 'react';
import { AuthForm } from '@/shared/ui/forms/AuthForm';

interface LoginOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginOverlay({ isOpen, onClose }: LoginOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-navaa-gray-600 hover:text-navaa-gray-900 transition-colors"
          aria-label="Schließen"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="pr-8">
          <h2 className="text-3xl font-bold text-navaa-gray-900 mb-6 text-center">
            Access only by invitation
          </h2>
          
          <div className="bg-white">
            <AuthForm type="login" />
          </div>
          
          <p className="mt-4 text-navaa-gray-700 text-center">
            Request access{' '}
            <a href="mailto:christian@christianmaass.com" className="text-navaa-accent hover:underline">
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

