/**
 * ACCOUNT SECTION COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Secure account operations with proper authentication
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useRouter } from 'next/router';

const AccountSection: React.FC = () => {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, logout, getAccessToken, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Account deletion states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deletionReason, setDeletionReason] = useState('');
  const [finalConfirmation, setFinalConfirmation] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Fehler beim Abmelden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if account deletion is allowed
  const canDelete = confirmationText === 'KONTO LÖSCHEN' && finalConfirmation;

  const handleDeleteAccount = async () => {
    if (!canDelete) {
      setDeleteError('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    try {
      setIsDeletingAccount(true);
      setDeleteError('');

      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for account deletion');
        throw new Error('Benutzer nicht authentifiziert. Bitte melden Sie sich an.');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for account deletion');
        throw new Error('Authentifizierungsfehler. Bitte erneut einloggen.');
      }

      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
        },
        body: JSON.stringify({
          confirmationText,
          reason: deletionReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setDeleteError(result.error || 'Fehler beim Löschen des Kontos');
        return;
      }

      // Success - account deleted
      alert('Ihr Konto wurde erfolgreich gelöscht. Sie werden zur Startseite weitergeleitet.');

      // Logout and redirect
      await logout();
      router.push('/');
    } catch (error: any) {
      console.error('Account deletion error:', error);
      setDeleteError('Netzwerkfehler. Bitte versuchen Sie es erneut.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Account-Verwaltung</h2>
        <p className="text-gray-600">Verwalten Sie Ihren Account und Sicherheitseinstellungen</p>
      </div>

      <div className="space-y-6">
        {/* Logout Section */}
        <div className="bg-[#00bfae]/10 border border-[#00bfae]/30 rounded-lg p-6">
          <h3 className="text-lg font-medium text-[#00bfae] mb-2">Abmelden</h3>
          <p className="text-gray-700 mb-4">Melden Sie sich sicher von Ihrem Konto ab.</p>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-[#00bfae] text-white px-4 py-2 rounded-md hover:bg-[#00a89a] transition-colors disabled:bg-[#00bfae]/50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Wird abgemeldet...</span>
              </>
            ) : (
              <span>Abmelden</span>
            )}
          </button>
        </div>

        {/* Account Deletion Section - Dezent */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Konto löschen</h3>
          <p className="text-gray-500 text-sm mb-3">
            ⚠️ <strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden. Ihr
            Konto wird dauerhaft deaktiviert und Ihre Daten werden DSGVO-konform verarbeitet.
          </p>

          {!showDeleteConfirmation ? (
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="bg-gray-200 text-gray-600 px-3 py-1.5 text-sm rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              Konto löschen
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border border-red-300 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-3">Bestätigung erforderlich</h4>

                <div className="space-y-4">
                  {/* Reason Selection */}
                  <div>
                    <label className="block text-sm font-medium text-red-800 mb-2">
                      Grund für die Löschung (optional)
                    </label>
                    <select
                      value={deletionReason}
                      onChange={(e) => setDeletionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="no_longer_needed">Service wird nicht mehr benötigt</option>
                      <option value="privacy_concerns">Datenschutzbedenken</option>
                      <option value="switching_service">Wechsel zu anderem Service</option>
                      <option value="technical_issues">Technische Probleme</option>
                      <option value="other">Sonstiges</option>
                    </select>
                  </div>

                  {/* Confirmation Text */}
                  <div>
                    <label className="block text-sm font-medium text-red-800 mb-2">
                      Geben Sie &quot;KONTO LÖSCHEN&quot; ein, um zu bestätigen:
                    </label>
                    <input
                      type="text"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="KONTO LÖSCHEN"
                    />
                  </div>

                  {/* Final Confirmation Checkbox */}
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="final-confirmation"
                      checked={finalConfirmation}
                      onChange={(e) => setFinalConfirmation(e.target.checked)}
                      className="mt-1 rounded border-red-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="final-confirmation" className="text-sm text-red-700">
                      Ich verstehe, dass diese Aktion nicht rückgängig gemacht werden kann und mein
                      Konto dauerhaft deaktiviert wird. Alle meine Daten werden DSGVO-konform
                      verarbeitet.
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {deleteError && (
                  <div className="mt-4 bg-red-100 border border-red-400 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{deleteError}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={!canDelete || isDeletingAccount}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isDeletingAccount ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Wird gelöscht...</span>
                      </>
                    ) : (
                      <span>Konto endgültig löschen</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirmation(false);
                      setConfirmationText('');
                      setDeletionReason('');
                      setFinalConfirmation(false);
                      setDeleteError('');
                    }}
                    disabled={isDeletingAccount}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSection;
