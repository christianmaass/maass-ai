/**
 * PROFILE SECTION COMPONENT
 * Migrated to navaa Auth Guidelines (WP-B1)
 *
 * COMPLIANCE:
 * - Uses useAuth() hook (MANDATORY)
 * - JWT token management via getAccessToken()
 * - Secure profile updates with proper authentication
 * - No direct supabase.auth calls
 *
 * @version 2.0.0 (WP-B1 Migration)
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileFormData {
  first_name: string;
  last_name: string;
}

interface ValidationErrors {
  first_name?: string;
  last_name?: string;
  general?: string;
}

const ProfileSection: React.FC = () => {
  // =============================================================================
  // NAVAA AUTH INTEGRATION (WP-B1 Migration)
  // =============================================================================

  const { user, profile, refreshProfile, getAccessToken, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.firstName || '',
        last_name: profile.lastName || '',
      });
    }
  }, [profile]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Vorname ist erforderlich';
    } else if (formData.first_name.length > 100) {
      newErrors.first_name = 'Vorname darf maximal 100 Zeichen haben';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Nachname ist erforderlich';
    } else if (formData.last_name.length > 100) {
      newErrors.last_name = 'Nachname darf maximal 100 Zeichen haben';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Use navaa Auth Guidelines - check authentication
      if (!isAuthenticated() || !user) {
        console.error('User not authenticated for profile update');
        throw new Error('Benutzer nicht authentifiziert. Bitte melden Sie sich an.');
      }

      // Get JWT token for API call (MANDATORY per navaa Guidelines)
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.error('Failed to get access token for profile update');
        throw new Error('Authentifizierungsfehler. Bitte erneut einloggen.');
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT token per navaa Guidelines
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details && typeof result.details === 'object') {
          setErrors(result.details);
        } else {
          setErrors({ general: result.error || 'Fehler beim Speichern' });
        }
        return;
      }

      // Success
      setSuccessMessage('Profil erfolgreich aktualisiert!');
      setIsEditing(false);

      // Refresh profile in AuthContext
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      setErrors({ general: 'Netzwerkfehler. Bitte versuchen Sie es erneut.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      first_name: profile?.firstName || '',
      last_name: profile?.lastName || '',
    });
    setIsEditing(false);
    setErrors({});
    setSuccessMessage('');
  };

  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : 'Nicht gesetzt';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil</h2>
        <p className="text-gray-600">Verwalten Sie Ihre persönlichen Informationen</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800">{errors.general}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email (Read-only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse</label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
            {user?.email || 'Nicht verfügbar'}
          </div>
          <p className="text-xs text-gray-500 mt-1">E-Mail-Adresse kann nicht geändert werden</p>
        </div>

        {/* Current First and Last Name (Read-only when not editing) */}
        {!isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vorname</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {profile?.firstName || 'Nicht gesetzt'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nachname</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                {profile?.lastName || 'Nicht gesetzt'}
              </div>
            </div>
          </div>
        )}

        {/* Editable Fields */}
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vorname *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfae] ${
                  errors.first_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ihr Vorname"
                maxLength={100}
              />
              {errors.first_name && (
                <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nachname *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfae] ${
                  errors.last_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ihr Nachname"
                maxLength={100}
              />
              {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#00bfae] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#009688] transition-colors"
            >
              Profil bearbeiten
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#00bfae] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#009688] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Speichern...' : 'Speichern'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
