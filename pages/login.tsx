import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading: authLoading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const q = router.query?.redirect;
    if (!q || Array.isArray(q)) return '/app';
    try {
      // basic sanitization: only allow in-app paths
      const url = new URL(q, 'http://local');
      return url.pathname.startsWith('/') ? url.pathname + url.search : '/app';
    } catch {
      return '/app';
    }
  }, [router.query]);

  useEffect(() => {
    if (error) setLocalError((error as any)?.message ?? String(error));
  }, [error]);

  useEffect(() => {
    // Already logged in? Go to redirect target
    if (isAuthenticated() && !authLoading) {
      void router.replace(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const validate = () => {
    if (!email || !email.includes('@')) return 'Bitte eine gültige E-Mail angeben';
    if (!password || password.length < 6) return 'Passwort muss mindestens 6 Zeichen haben';
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError?.();
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    try {
      setSubmitting(true);
      await login(email.trim(), password);
      await router.replace(redirectTo);
    } catch (e: any) {
      setLocalError(e?.message || 'Login fehlgeschlagen');
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || authLoading;

  return (
    <>
      <Head>
        <title>Login | navaa.ai</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-navaa-bg-primary p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-600 mb-6">Willkommen zurück bei navaa.ai</p>

          {localError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              {localError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00bfae]"
                placeholder="you@example.com"
                disabled={isBusy}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00bfae]"
                placeholder="••••••••"
                disabled={isBusy}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className={`w-full flex justify-center items-center gap-2 rounded-md px-4 py-2 text-white font-medium transition-colors ${
                isBusy ? 'bg-[#00bfae]/70 cursor-not-allowed' : 'bg-[#00bfae] hover:bg-[#009688]'
              }`}
            >
              {isBusy && (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isBusy ? 'Anmelden…' : 'Anmelden'}</span>
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            Noch kein Account?
            <Link href="/register" className="ml-2 text-[#00bfae] hover:text-[#009688] font-medium">
              Jetzt registrieren
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
