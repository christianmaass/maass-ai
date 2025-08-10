import React from 'react';
import Head from 'next/head';

interface ImpressumOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImpressumOverlay: React.FC<ImpressumOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <Head>
        <title>Impressum</title>
      </Head>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative text-gray-800">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">Impressum</h1>
        <div className="space-y-4 text-base">
          <p>
            <strong>Angaben gemäß § 5 TMG:</strong>
          </p>
          <p>
            Dr. Christian Maaß
            <br />
            Am Leinritt 7<br />
            96049 Bamberg
          </p>
          <p>
            E-Mail:{' '}
            <a href="mailto:christian@christianmaass.com" className="text-blue-700 underline">
              christian@christianmaass.com
            </a>
          </p>
          <p>
            <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong>
            <br />
            Christian Maaß, Anschrift wie oben.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpressumOverlay;
