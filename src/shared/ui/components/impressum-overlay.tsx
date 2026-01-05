'use client';

import { useEffect } from 'react';

interface ImpressumOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImpressumOverlay({ isOpen, onClose }: ImpressumOverlayProps) {
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
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-navaa-gray-600 hover:text-navaa-gray-900 transition-colors"
          aria-label="Schließen"
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

        {/* Content */}
        <div className="pr-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Impressum</h2>

          <div className="mb-6 p-4 bg-navaa-warm-beige/30 rounded-lg border border-navaa-gray-200">
            <p className="text-sm text-navaa-gray-700">
              <strong>Legal Notice (Impressum)</strong> — This legal notice is provided in German as
              required by German law (§ 5 TMG - Telemediengesetz). It contains the legally required
              information about the website operator.
            </p>
          </div>

          <div className="space-y-4 text-navaa-gray-700">
            <div>
              <p className="font-semibold mb-2">Angaben gemäß § 5 TMG:</p>
              <p className="mb-1">Dr. Christian Maaß</p>
              <p className="mb-1">Am Leinritt 7</p>
              <p className="mb-4">96049 Bamberg</p>
            </div>

            <div>
              <p className="mb-2">
                <span className="font-semibold">E-Mail:</span>{' '}
                <a
                  href="mailto:christian@christianmaass.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  christian@christianmaass.com
                </a>
              </p>
            </div>

            <div>
              <p className="font-semibold mb-2">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
              </p>
              <p>Christian Maaß, Anschrift wie oben.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
