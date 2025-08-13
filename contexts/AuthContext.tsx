/**
 * NAVAA AUTH CONTEXT
 * Production-ready authentication context following navaa guidelines
 *
 * COMPLIANCE:
 * - JWT Token Management (getAccessToken, refreshToken)
 * - Role-based Access Control (hasRole, requireRole)
 * - Error Handling Standards
 * - Security First Approach
 * - Developer Experience Optimized
 *
 * @version 2.0.0
 * @author navaa Development Team
 */

/**
 * 🚀 NAVAA.AI DEVELOPMENT STANDARDS
 *
 * This file follows navaa.ai development guidelines:
 * 📋 CONTRIBUTING.md - Contribution standards and workflow
 * 📚 docs/navaa-development-guidelines.md - Complete development standards
 *
 * KEY STANDARDS FOR THIS FILE:
 * ✅ Stability First - Never change working features without clear reason
 * ✅ Security First - JWT authentication, RLS compliance
 * ✅ AuthContext Completeness - Load ALL user fields from database
 * ✅ Schema Sync - Update mapping after DB migrations
 * ✅ Naming Conventions - Consistent camelCase ↔ snake_case mapping
 * ✅ Error Handling - Structured logging with user context
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { getSupabaseClient } from '@supabaseClient';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// =============================================================================
// TYPES & INTERFACES (navaa Guidelines Compliant)
// =============================================================================

/**
 * User roles as defined in navaa auth guidelines
 */
export type UserRole = 'user' | 'test_user' | 'moderator' | 'admin' | 'super_admin';

/**
 * Auth error codes for consistent error handling
 */
export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_CONFIRMED'
  | 'WEAK_PASSWORD'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Standardized auth error interface
 */
export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: any;
}

/**
 * User interface (simplified, security-focused)
 */
export interface User {
  id: string;
  email: string;
  emailConfirmed: boolean;
  lastSignInAt?: string;
  created_at?: string;
  user_metadata?: {
    created_at?: string;
    [key: string]: any;
  };
}

/**
 * User profile with role-based access control
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional Ablauf für Test-/temporäre User (siehe manual-migration.sql)
  expiresAt?: string;
  // User-Tracking-Felder (nach Migration hinzugefügt)
  login_count?: number;
  onboarding_completed?: boolean;
  first_login_at?: string;
  last_login_at?: string;
  last_activity_track?: string;
  last_activity_at?: string;
  current_course_id?: string;
  completed_courses_count?: number;
}

/**
 * JWT token information
 */
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

/**
 * Auth Context Type (navaa Guidelines Compliant)
 */
export interface AuthContextType {
  // Core State
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  authLoading: boolean; // Alias for loading (backward compatibility)
  error: AuthError | null;

  // Authentication Methods
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // JWT Token Management (MANDATORY per Guidelines)
  getAccessToken: () => Promise<string | null>;
  refreshToken: () => Promise<boolean>;

  // Role-based Access Control
  hasRole: (role: UserRole | UserRole[]) => boolean;
  requireRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;

  // Profile Management
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

  // Utility Methods
  clearError: () => void;
  isAuthenticated: () => boolean;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * useAuth Hook - MANDATORY for all components per navaa Guidelines
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider - navaa Auth Guidelines violation',
    );
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // =============================================================================
  // STATE MANAGEMENT
  // =============================================================================

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const supabase = getSupabaseClient();

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  /**
   * Error handler following navaa Guidelines
   */
  const handleAuthError = useCallback((error: any): AuthError => {
    let authError: AuthError;

    if (error?.message?.includes('Invalid login credentials')) {
      authError = { code: 'INVALID_CREDENTIALS', message: 'Ungültige Anmeldedaten' };
    } else if (error?.message?.includes('Email not confirmed')) {
      authError = { code: 'EMAIL_NOT_CONFIRMED', message: 'E-Mail noch nicht bestätigt' };
    } else if (error?.message?.includes('Password should be at least')) {
      authError = { code: 'WEAK_PASSWORD', message: 'Passwort zu schwach' };
    } else if (error?.message?.includes('rate limit')) {
      authError = { code: 'RATE_LIMIT_EXCEEDED', message: 'Zu viele Versuche' };
    } else {
      authError = {
        code: 'UNKNOWN_ERROR',
        message: error?.message || 'Unbekannter Fehler',
        details: error,
      };
    }

    setError(authError);
    return authError;
  }, []);

  /**
   * Convert Supabase user to navaa User format
   */
  const convertSupabaseUser = useCallback((supabaseUser: SupabaseUser): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      emailConfirmed: !!supabaseUser.email_confirmed_at,
      lastSignInAt: supabaseUser.last_sign_in_at || undefined,
    };
  }, []);

  /**
   * Load user profile with error handling
   */
  const loadUserProfile = useCallback(
    async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select(
            'id, email, first_name, last_name, role, created_at, updated_at, expires_at, login_count, onboarding_completed, first_login_at, last_login_at, last_activity_track, last_activity_at, current_course_id, completed_courses_count',
          )
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          handleAuthError(error);
          return;
        }

        // Convert to navaa UserProfile format
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          firstName: data.first_name || undefined,
          lastName: data.last_name || undefined,
          role: (data.role as UserRole) || 'user',
          isActive: true, // Assume active if profile exists
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          expiresAt: data.expires_at || undefined,
          // User-Tracking-Felder (nach Migration hinzugefügt)
          login_count: data.login_count,
          onboarding_completed: data.onboarding_completed,
          first_login_at: data.first_login_at,
          last_login_at: data.last_login_at,
          last_activity_track: data.last_activity_track,
          last_activity_at: data.last_activity_at,
          current_course_id: data.current_course_id,
          completed_courses_count: data.completed_courses_count,
        };

        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
        handleAuthError(error);
      }
    },
    [supabase, handleAuthError],
  );

  // =============================================================================
  // INITIALIZATION & SESSION MANAGEMENT
  // =============================================================================

  useEffect(() => {
    let isMounted = true;

    // Get initial session and await profile
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);
        if (session?.user) {
          const userData = convertSupabaseUser(session.user);
          setUser(userData);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    // Listen for auth changes and await profile
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setLoading(true);
        try {
          setSession(session);
          if (session?.user) {
            const userData = convertSupabaseUser(session.user);
            setUser(userData);
            await loadUserProfile(session.user.id);
          } else {
            setUser(null);
            setProfile(null);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      })();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [convertSupabaseUser, loadUserProfile, supabase]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw new Error(error.message);
    }

    // Redirect to homepage where intelligent routing logic will handle user flow
    router.push('/');
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const fullName = `${firstName} ${lastName}`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Redirect to homepage where intelligent routing logic will handle user flow
    router.push('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // =============================================================================
  // JWT TOKEN MANAGEMENT (MANDATORY per navaa Guidelines)
  // =============================================================================

  // Simple in-memory token cache to avoid repeated async getSession() calls
  // Not persisted; resets on reload, which is fine. Skew to refresh a bit before expiry.
  const tokenCacheRef = useRef<{ token: string | null; expiresAtSec: number | null }>({
    token: null,
    expiresAtSec: null,
  });
  const TOKEN_SKEW_SECONDS = 60; // refresh 60s before expiry

  /**
   * Get access token for API calls - MANDATORY per navaa Guidelines
   */
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      // Serve cached token if still valid
      const nowSec = Math.floor(Date.now() / 1000);
      if (
        tokenCacheRef.current.token &&
        tokenCacheRef.current.expiresAtSec &&
        nowSec < tokenCacheRef.current.expiresAtSec - TOKEN_SKEW_SECONDS
      ) {
        return tokenCacheRef.current.token;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.access_token) {
        console.error('Error getting access token:', error);
        return null;
      }
      // Cache token with expiry
      const expiresAtSec =
        (session as any)?.expires_at ?? (session?.expires_in ? nowSec + session.expires_in : null);
      tokenCacheRef.current = { token: session.access_token, expiresAtSec };
      return session.access_token;
    } catch (error) {
      console.error('Error in getAccessToken:', error);
      handleAuthError(error);
      return null;
    }
  }, [supabase, handleAuthError]);

  /**
   * Refresh JWT token
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        console.error('Error refreshing token:', error);
        handleAuthError(error);
        return false;
      }

      setSession(data.session);
      return true;
    } catch (error) {
      console.error('Error in refreshToken:', error);
      handleAuthError(error);
      return false;
    }
  }, [supabase, handleAuthError]);

  // =============================================================================
  // ROLE-BASED ACCESS CONTROL (navaa Guidelines)
  // =============================================================================

  /**
   * Check if user has specific role(s)
   */
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!profile) return false;

      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(profile.role);
    },
    [profile],
  );

  /**
   * Require specific role(s) - throws error if not authorized
   */
  const requireRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      const hasRequiredRole = hasRole(role);

      if (!hasRequiredRole) {
        const roleStr = Array.isArray(role) ? role.join(', ') : role;
        throw new Error(`Access denied. Required role(s): ${roleStr}`);
      }

      return true;
    },
    [hasRole],
  );

  /**
   * Check if user is admin (admin or super_admin)
   */
  const isAdmin = useCallback((): boolean => {
    return hasRole(['admin', 'super_admin']);
  }, [hasRole]);

  // =============================================================================
  // PROFILE MANAGEMENT
  // =============================================================================

  /**
   * Refresh user profile
   */
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    await loadUserProfile(user.id);
  }, [user, loadUserProfile]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const { data: _data, error } = await supabase
          .from('user_profiles')
          .update({
            first_name: updates.firstName,
            last_name: updates.lastName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating profile:', error);
          handleAuthError(error);
          throw error;
        }

        // Refresh profile after update
        await refreshProfile();
      } catch (error) {
        console.error('Error in updateProfile:', error);
        handleAuthError(error);
        throw error;
      }
    },
    [user, supabase, handleAuthError, refreshProfile],
  );

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!(user && session);
  }, [user, session]);

  // =============================================================================
  // CONTEXT VALUE (navaa Guidelines Compliant)
  // =============================================================================

  const value: AuthContextType = {
    // Core State
    user,
    profile,
    session,
    loading,
    authLoading: loading, // Alias for backward compatibility
    error,

    // Authentication Methods
    login,
    register,
    logout,

    // JWT Token Management (MANDATORY per Guidelines)
    getAccessToken,
    refreshToken,

    // Role-based Access Control
    hasRole,
    requireRole,
    isAdmin,

    // Profile Management
    refreshProfile,
    updateProfile,

    // Utility Methods
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
