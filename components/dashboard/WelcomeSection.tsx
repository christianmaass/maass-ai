import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

interface WelcomeStatus {
  isFirstTime: boolean;
  loginCount: number;
  firstName: string | null;
  lastActivityTrack: string | null;
  lastActivityAt: string | null;
  currentCase?: {
    id: string;
    title: string;
    isCompleted: boolean;
  } | null;
  nextAction: {
    type: 'onboarding' | 'continue_case' | 'new_case';
    label: string;
    href: string;
  };
}

/**
 * WelcomeSection Component
 * Personalized welcome experience based on user status (new/returning)
 * Integrates with Dashboard and follows navaa UX guidelines
 */
export default function WelcomeSection() {
  const { user, getAccessToken, isAuthenticated } = useAuth();
  const [welcomeStatus, setWelcomeStatus] = useState<WelcomeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWelcomeStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessToken();
      if (!token) {
        throw new Error('No access token available');
      }

      const response = await fetch('/api/user/welcome-status', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load welcome status: ${response.status}`);
      }

      const data: WelcomeStatus = await response.json();
      setWelcomeStatus(data);
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler beim Laden des Welcome-Status');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    if (!isAuthenticated() || !user) {
      setLoading(false);
      return;
    }

    fetchWelcomeStatus();
  }, [user, isAuthenticated, fetchWelcomeStatus]);

  // Loading state
  if (loading) {
    return (
      <section className="w-full bg-gradient-to-br from-[#f6f4f0] to-[#f0ede7] rounded-3xl p-6 md:p-8 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded-xl w-48"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !welcomeStatus) {
    return (
      <section className="w-full bg-gradient-to-br from-[#f6f4f0] to-[#f0ede7] rounded-3xl p-6 md:p-8 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Willkommen bei navaa!</h2>
          <p className="text-gray-600 mb-6">Bereit für deine Lernreise?</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#009e82] to-[#00bfae] text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Dashboard erkunden
          </Link>
        </div>
      </section>
    );
  }

  const { isFirstTime, firstName, lastActivityTrack, currentCase, nextAction } = welcomeStatus;

  // New User Welcome
  if (isFirstTime) {
    return (
      <section className="w-full bg-gradient-to-br from-[#f6f4f0] to-[#f0ede7] rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-24 h-24 bg-[#009e82] rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#00bfae] rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">👋</span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Willkommen bei navaa, {firstName || 'Lernender'}!
              </h2>
            </div>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Starte jetzt dein Onboarding und entdecke, wie navaa dein strategisches Denken und
              deine Entscheidungsfindung verbessert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href={nextAction.href}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#009e82] to-[#00bfae] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700 ease-out"></div>

                <span className="relative z-10 flex items-center">
                  <span className="mr-2">🚀</span>
                  {nextAction.label}
                  <svg
                    className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>

              <div className="text-sm text-gray-600 flex items-center">
                <span className="text-green-500 mr-1">✓</span>
                Kostenlos und unverbindlich
              </div>
            </div>
          </div>

          {/* Intro Image/Video Placeholder */}
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-full h-48 bg-gradient-to-br from-[#009e82] to-[#00bfae] rounded-xl flex items-center justify-center mb-4">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm font-medium">Intro-Video</p>
                  <p className="text-xs opacity-75">Coming Soon</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Lerne navaa in 2 Minuten kennen</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Returning User Welcome
  return (
    <section className="w-full bg-gradient-to-br from-[#f6f4f0] to-[#f0ede7] rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-24 h-24 bg-[#009e82] rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#00bfae] rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🎉</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Willkommen zurück, {firstName || 'Lernender'}!
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            {/* Last Activity Info */}
            {lastActivityTrack && (
              <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📚</span>
                  <div>
                    <p className="text-sm text-gray-600">Zuletzt aktiv im</p>
                    <p className="font-semibold text-gray-900">{lastActivityTrack}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Case Info */}
            {currentCase && (
              <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  <div>
                    <p className="text-sm text-gray-600">Aktueller Case</p>
                    <p className="font-semibold text-gray-900">{currentCase.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Link
              href={nextAction.href}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#009e82] to-[#00bfae] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700 ease-out"></div>

              <span className="relative z-10 flex items-center">
                <span className="mr-2">{nextAction.type === 'continue_case' ? '▶️' : '🚀'}</span>
                {nextAction.label}
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          </div>

          {/* Progress Indicator or Quick Stats */}
          <div className="flex-1 max-w-md">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Dein Fortschritt</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Logins</span>
                  <span className="font-semibold text-[#009e82]">{welcomeStatus.loginCount}</span>
                </div>
                {lastActivityTrack && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Letzter Track</span>
                    <span className="font-semibold text-[#009e82]">{lastActivityTrack}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">Weiter so! 🎯</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
