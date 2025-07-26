import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { getSupabaseClient } from '../supabaseClient';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseClient();
      
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      // Get user tariff info from API
      const response = await fetch('/api/user-tariff');
      if (response.ok) {
        const tariffData = await response.json();
        setUserProfile({
          tariff: tariffData.tariff_display_name,
          tariffName: tariffData.tariff_name,
          casesUsed: tariffData.cases_used_this_week,
          casesLimit: tariffData.cases_per_week,
          casesUsedMonth: tariffData.cases_used_this_month,
          casesLimitMonth: tariffData.cases_per_month,
          subscriptionStatus: tariffData.subscription_status,
          currentPeriodEnd: tariffData.current_period_end,
          cancelAtPeriodEnd: tariffData.cancel_at_period_end,
          features: tariffData.features,
          nextReset: getNextWeekReset()
        });
      } else {
        // Fallback zu Free-Tarif
        setUserProfile({
          tariff: 'Free',
          tariffName: 'Free',
          casesUsed: 0,
          casesLimit: 5,
          casesUsedMonth: 0,
          casesLimitMonth: 20,
          subscriptionStatus: 'active',
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          features: {},
          nextReset: getNextWeekReset()
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextWeekReset = () => {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    return nextMonday.toLocaleDateString('de-DE');
  };

  const handleCancelSubscription = () => {
    // Placeholder for subscription cancellation
    alert('Kündigung wird in einem späteren Schritt implementiert');
  };

  const handleUpgrade = () => {
    // Placeholder for upgrade functionality
    alert('Upgrade wird in einem späteren Schritt implementiert');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <Head>
        <title>Benutzerprofil</title>
      </Head>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative text-gray-800 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        
        <h1 className="text-2xl font-bold mb-6 text-center">Benutzerprofil</h1>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Lade Benutzerdaten...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Benutzer-Informationen */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Konto-Informationen</h2>
              <div className="space-y-2">
                <p><strong>E-Mail:</strong> {user?.email || 'Nicht verfügbar'}</p>
                <p><strong>Registriert seit:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString('de-DE') : 'Nicht verfügbar'}</p>
              </div>
            </div>

            {/* Aktueller Tarif */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Aktueller Tarif</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span><strong>Tarif:</strong></span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {userProfile?.tariff || 'Free'}
                  </span>
                </div>
                
                {/* Wöchentliche Cases */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span><strong>Cases diese Woche:</strong></span>
                    <span>{userProfile?.casesUsed || 0} / {userProfile?.casesLimit || 5}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(((userProfile?.casesUsed || 0) / (userProfile?.casesLimit || 5)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Zurücksetzung: {userProfile?.nextReset || 'Nicht verfügbar'}
                  </p>
                </div>

                {/* Monatliche Cases (falls unterschiedlich) */}
                {userProfile?.casesLimitMonth && userProfile.casesLimitMonth !== (userProfile.casesLimit * 4) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span><strong>Cases diesen Monat:</strong></span>
                      <span>{userProfile?.casesUsedMonth || 0} / {userProfile?.casesLimitMonth || 20}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(((userProfile?.casesUsedMonth || 0) / (userProfile?.casesLimitMonth || 20)) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Subscription Status */}
                {userProfile?.subscriptionStatus && userProfile.subscriptionStatus !== 'active' && (
                  <div className="text-sm text-orange-600">
                    <strong>Status:</strong> {userProfile.subscriptionStatus}
                  </div>
                )}
                
                {userProfile?.currentPeriodEnd && (
                  <div className="text-sm text-gray-600">
                    <strong>Verlängerung:</strong> {new Date(userProfile.currentPeriodEnd).toLocaleDateString('de-DE')}
                  </div>
                )}
              </div>
            </div>

            {/* Tarif-Management */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Tarif-Management</h2>
              <div className="space-y-3">
                {userProfile?.tariff === 'Free' ? (
                  <div>
                    <p className="text-gray-600 mb-3">
                      Upgrade auf einen bezahlten Tarif für mehr Cases und erweiterte Features.
                    </p>
                    <button
                      onClick={handleUpgrade}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Jetzt upgraden
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-3">
                      Du kannst dein Abonnement jederzeit kündigen. Die Kündigung wird zum Ende des aktuellen Abrechnungszeitraums wirksam.
                    </p>
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Abonnement kündigen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Konto-Aktionen */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">Konto-Aktionen</h2>
              <div className="space-y-2">
                <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2 px-3 rounded hover:bg-blue-50 transition-colors">
                  Passwort ändern
                </button>
                <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2 px-3 rounded hover:bg-blue-50 transition-colors">
                  E-Mail-Adresse ändern
                </button>
                <button className="w-full text-left text-red-600 hover:text-red-800 py-2 px-3 rounded hover:bg-red-50 transition-colors">
                  Konto löschen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
