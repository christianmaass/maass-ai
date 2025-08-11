import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

/**
 * UnifiedGuard
 * - Single source of truth for route protection and redirects
 * - Prevents redirect loops with simple detection
 * - Provides loading and error fallbacks
 * - Follows navaa guidelines (see memory)
 */

type Props = {
  children: React.ReactNode;
  routePathname?: string; // optionally pass from _app to avoid router in deps
};

const LOOP_MAX = 3;

function isAdminRoute(pathname: string) {
  return pathname.startsWith('/admin');
}

function isPublicRoute(pathname: string) {
  // Extend as needed: marketing pages, legal, register/login, etc.
  const publicPrefixes = [
    '/',
    '/preise',
    '/impressum',
    '/lernansatz',
    '/register',
    '/login',
    '/test-backend',
  ];
  return publicPrefixes.some((p) => (p === '/' ? pathname === '/' : pathname.startsWith(p)));
}

function isProtectedRoute(pathname: string) {
  // Any route not explicitly public is protected by default,
  // except API and Next internals which do not render through this guard.
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return false;
  return !isPublicRoute(pathname);
}

export const UnifiedGuard: React.FC<Props> = ({ children, routePathname }) => {
  const router = useRouter();
  const { loading, isAuthenticated, profile } = useAuth();

  const pathname = routePathname || router.pathname;

  const [guardError, setGuardError] = useState<string | null>(null);
  const redirectRef = useRef<{ count: number; lastTo: string | null }>({ count: 0, lastTo: null });

  const needsAdmin = useMemo(() => isAdminRoute(pathname), [pathname]);
  const isPublic = useMemo(() => isPublicRoute(pathname), [pathname]);
  const isProtected = useMemo(() => isProtectedRoute(pathname), [pathname]);

  // Redirect helper with loop prevention
  const safeRedirect = async (to: string) => {
    if (redirectRef.current.lastTo === to) {
      redirectRef.current.count += 1;
    } else {
      redirectRef.current.lastTo = to;
      redirectRef.current.count = 1;
    }

    if (redirectRef.current.count > LOOP_MAX) {
      setGuardError('Routing-Fehler: Redirect-Loop verhindert.');
      return;
    }

    await router.push(to);
  };

  useEffect(() => {
    // Stability first: only act when we have enough state
    if (loading) return;

    try {
      const authed = isAuthenticated();

      // Public routes always allowed
      if (isPublic) return;

      // Protected routes require auth
      if (isProtected && !authed) {
        void safeRedirect('/login');
        return;
      }

      // Admin routes require admin role
      if (needsAdmin) {
        const isAdmin = profile ? ['admin', 'super_admin'].includes(profile.role) : false;
        if (!isAdmin) {
          void safeRedirect('/');
          return;
        }
      }
    } catch (e) {
      console.error('UnifiedGuard error:', e);
      setGuardError('Guard-Fehler. Bitte erneut versuchen.');
    }
  // Intentionally depend only on resolved flags and pathname to avoid router in deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, pathname, isPublic, isProtected, needsAdmin]);

  // Loading fallback while auth state resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          <span>Bitte warten…</span>
        </div>
      </div>
    );
  }

  // Error fallback
  if (guardError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-4">
          <h2 className="text-red-700 font-semibold mb-2">Zugriff verweigert</h2>
          <p className="text-sm text-red-700">{guardError}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UnifiedGuard;
