import React from 'react';
import { Heading, Text } from '../../components/ui/Typography';

interface PaymentSuccessViewProps {
  sessionId?: string | string[];
  onContinue: () => void;
}

const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({ sessionId, onContinue }) => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Success Message */}
        <Heading variant="h1" className="mb-4">
          Zahlung erfolgreich! 🎉
        </Heading>

        <Text variant="body" as="p" className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Vielen Dank für dein Vertrauen! Dein navaa.ai Plus-Abonnement wurde erfolgreich aktiviert. Du kannst jetzt alle erweiterten Features nutzen und bis zu 25 Cases pro Woche bearbeiten.
        </Text>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 max-w-md mx-auto">
          <Heading variant="h2" className="mb-4">
            Deine neuen Features:
          </Heading>
          <ul className="space-y-2 text-left">
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><span className="text-gray-700">25 Cases pro Woche</span></li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><span className="text-gray-700">Erweiterte Bewertung</span></li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><span className="text-gray-700">Priority Support</span></li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><span className="text-gray-700">Premium Templates</span></li>
            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span><span className="text-gray-700">Fortschritts-Analytics</span></li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button onClick={onContinue} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Jetzt loslegen
          </button>

          <div className="text-sm text-gray-500">
            <p>Du erhältst eine Bestätigungs-E-Mail mit allen Details.</p>
            <p className="mt-1">
              Session ID: <span className="font-mono text-xs">{sessionId}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccessView;
