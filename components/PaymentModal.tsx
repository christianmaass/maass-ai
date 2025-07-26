import React, { useState } from 'react';
import Head from 'next/head';
import { stripePromise } from '../lib/stripe';
import { getSupabaseClient } from '../supabaseClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    displayName: string;
    price: string;
    priceId?: string;
  } | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Prüfen ob User eingeloggt ist
      const supabase = getSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setRequiresLogin(true);
        setLoading(false);
        return;
      }

      // 2. Für Free-Plan: Direkt zuweisen ohne Stripe
      if (selectedPlan?.name === 'Free') {
        const response = await fetch('/api/assign-free-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Free-Plan erfolgreich aktiviert!');
          onClose();
          window.location.reload(); // Seite neu laden für aktualisierte Daten
        } else {
          const errorData = await response.json();
          console.error('Free-Plan API Error:', errorData);
          throw new Error(`Fehler beim Aktivieren des Free-Plans: ${errorData.error || response.status}`);
        }
        return;
      }

      // 3. Für bezahlte Pläne: Stripe Checkout
      if (selectedPlan?.name === 'Plus') {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            planName: selectedPlan.name,
            planDisplayName: selectedPlan.displayName,
          }),
        });

        const { sessionId, error: sessionError } = await response.json();

        if (sessionError) {
          throw new Error(sessionError);
        }

        // Stripe Checkout öffnen
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe konnte nicht geladen werden');
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      } else {
        // Für Business und Bildungsträger: Kontakt-Info
        alert(`Für den ${selectedPlan?.displayName}-Plan kontaktieren Sie uns bitte unter: christian@christianmaass.com`);
        onClose();
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setRequiresLogin(false);
    onClose();
    // Hier könnte man ein Login-Modal öffnen oder zur Login-Seite weiterleiten
    alert('Bitte loggen Sie sich zuerst ein, um einen Tarif zu wählen.');
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <Head>
        <title>Tarif auswählen - {selectedPlan.displayName}</title>
      </Head>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative text-gray-800">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        
        <h1 className="text-2xl font-bold mb-6 text-center">
          {selectedPlan.displayName} Tarif
        </h1>

        {requiresLogin ? (
          <div className="text-center space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Sie müssen sich zuerst anmelden, um einen Tarif zu wählen.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Jetzt anmelden
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tarif-Details */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold mb-2">{selectedPlan.displayName}</h3>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {selectedPlan.price}
              </div>
              {selectedPlan.name === 'Free' && (
                <p className="text-sm text-gray-600">
                  5 Cases pro Woche • Grundlegende Features
                </p>
              )}
              {selectedPlan.name === 'Plus' && (
                <p className="text-sm text-gray-600">
                  25 Cases pro Woche • Erweiterte Features
                </p>
              )}
              {(selectedPlan.name === 'Business' || selectedPlan.name === 'Bildungsträger') && (
                <p className="text-sm text-gray-600">
                  Individuelle Lösung • Persönliche Beratung
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : selectedPlan.name === 'Free'
                    ? 'bg-gray-800 text-white hover:bg-gray-900'
                    : selectedPlan.name === 'Plus'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Wird verarbeitet...
                  </span>
                ) : selectedPlan.name === 'Free' ? (
                  'Kostenlos aktivieren'
                ) : selectedPlan.name === 'Plus' ? (
                  'Jetzt kaufen'
                ) : (
                  'Kontakt aufnehmen'
                )}
              </button>
              
              <button
                onClick={onClose}
                disabled={loading}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>

            {selectedPlan.name === 'Plus' && (
              <p className="text-xs text-gray-500 text-center">
                Sichere Zahlung über Stripe • Monatlich kündbar
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
