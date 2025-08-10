import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseClient } from '../supabaseClient';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseProfileReturn {
  profile: Profile | null;
  profileLoading: boolean;
  profileError: string | null;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileError(null);
      return;
    }

    setProfileLoading(true);
    setProfileError(null);

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Profile loading failed:', error);

        // Fallback: Create minimal profile from auth data
        const fallbackProfile: Profile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role: 'user',
        };

        setProfile(fallbackProfile);
        setProfileError('Profile nicht gefunden, verwende Fallback-Daten');
      } else {
        setProfile(data);
        setProfileError(null);
      }
    } catch (error) {
      console.error('Profile loading error:', error);

      // Fallback: Create minimal profile from auth data
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: 'user',
      };

      setProfile(fallbackProfile);
      setProfileError('Fehler beim Laden des Profils, verwende Fallback-Daten');
    } finally {
      setProfileLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadProfile();
  }, [user, loadProfile]);

  const refreshProfile = async () => {
    await loadProfile();
  };

  const isAdmin = profile?.role === 'admin';

  return {
    profile,
    profileLoading,
    profileError,
    isAdmin,
    refreshProfile,
  };
};
