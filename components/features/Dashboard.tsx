import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import { getSupabaseClient } from '../../supabaseClient';
import Describtion_Case_Start, { CaseData } from './Describtion_Case_Start';
import CaseDisplay from './CaseDisplay';
import ResponseInput from './ResponseInput';
import AssessmentDisplay from './AssessmentDisplay';

interface DashboardProps {
  isNewUser?: boolean;
}

export default function Dashboard({ isNewUser = false }: DashboardProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [stats, setStats] = useState({
    totalCases: 0,
    completedAssessments: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);

  // Case Management State
  const [currentCase, setCurrentCase] = useState<CaseData | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'welcome' | 'case' | 'response' | 'assessment'>(
    'welcome',
  );

  // moved below loadUserStats to avoid TDZ

  const loadUserStats = useCallback(async () => {
    if (!user) return;

    try {
      // TEMP: Assessments deaktiviert wegen 400 Error - Mock-Daten verwenden
      // const supabase = getSupabaseClient();
      // const { data: assessments } = await supabase.from('assessments').select('score').limit(5);

      // Mock-Daten für Demo
      setStats({
        totalCases: 3,
        completedAssessments: 2,
        averageScore: 7.5,
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserStats();
  }, [loadUserStats]);

  // Case Management Handlers
  const handleCaseGenerated = (caseData: CaseData) => {
    setCurrentCase(caseData);
    setCurrentView('case');
  };

  const handleResponseSubmitted = (responseId: string) => {
    setCurrentView('response');
  };

  const handleAssessmentReceived = (assessmentId: string) => {
    setAssessmentId(assessmentId);
    setCurrentView('assessment');
  };

  const handleBackToWelcome = () => {
    setCurrentCase(null);
    setAssessmentId(null);
    setCurrentView('welcome');
  };

  if (isNewUser) {
    return (
      <div className="navaa-page navaa-bg-primary min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Dynamic Case Workflow */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Welcome/Case Start */}
            <div className="flex-1">
              {currentView === 'welcome' && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#00bfae] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-white"
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
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Dashboard - {profile?.first_name || user?.email?.split('@')[0] || 'User'}
                    </h1>
                    <p className="text-lg text-gray-600 mb-6">
                      Bereit für den nächsten Case? Wählen Sie einen Bereich und starten Sie Ihr
                      Training.
                    </p>
                  </div>

                  {/* Integrated Case Start */}
                  <Describtion_Case_Start onCaseGenerated={handleCaseGenerated} />
                </div>
              )}

              {currentView === 'case' && currentCase && (
                <div className="space-y-6">
                  {/* Case Display */}
                  <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="mb-4">
                      <button
                        onClick={handleBackToWelcome}
                        className="text-[#00bfae] hover:text-[#009688] flex items-center gap-2 mb-4"
                      >
                        ← Zurück zum Dashboard
                      </button>
                    </div>
                    <CaseDisplay caseData={currentCase} />
                  </div>

                  {/* Response Input */}
                  <div className="bg-white rounded-xl shadow-sm p-8">
                    <h3 className="text-xl font-semibold mb-4">Deine Antwort</h3>
                    <ResponseInput
                      caseData={currentCase}
                      onResponseSubmitted={handleResponseSubmitted}
                    />
                  </div>
                </div>
              )}

              {currentView === 'response' && currentCase && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-4">
                    <button
                      onClick={handleBackToWelcome}
                      className="text-[#00bfae] hover:text-[#009688] flex items-center gap-2 mb-4"
                    >
                      ← Zurück zum Dashboard
                    </button>
                  </div>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
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
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Antwort eingereicht!</h3>
                    <p className="text-gray-600 mb-6">
                      Deine Antwort wird jetzt von unserer KI bewertet. Das dauert nur wenige
                      Sekunden.
                    </p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bfae] mx-auto"></div>
                  </div>
                </div>
              )}

              {currentView === 'assessment' && assessmentId && (
                <div className="bg-white rounded-xl shadow-sm p-8">
                  <div className="mb-4">
                    <button
                      onClick={handleBackToWelcome}
                      className="text-[#00bfae] hover:text-[#009688] flex items-center gap-2 mb-4"
                    >
                      ← Neuen Case starten
                    </button>
                  </div>
                  <AssessmentDisplay assessmentId={assessmentId} />
                </div>
              )}
            </div>

            {/* Right Side - Stats & Guide (only show on welcome) */}
            {currentView === 'welcome' && (
              <div className="lg:w-80">
                {/* User Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Dein Fortschritt</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cases bearbeitet:</span>
                      <span className="font-semibold">{stats.totalCases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bewertungen:</span>
                      <span className="font-semibold">{stats.completedAssessments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ø Score:</span>
                      <span className="font-semibold">{stats.averageScore}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Start Guide */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">1. Case auswählen</h3>
              <p className="text-gray-600 text-sm">
                Wähle aus verschiedenen Consulting-Cases und starte dein Training.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">2. Lösung erarbeiten</h3>
              <p className="text-gray-600 text-sm">
                Analysiere den Case und entwickle deine strukturierte Lösung.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">3. Feedback erhalten</h3>
              <p className="text-gray-600 text-sm">
                Erhalte detailliertes KI-Feedback und verbessere deine Skills.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4f0]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Willkommen zurück, {user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Bereit für dein nächstes Consulting-Training?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bearbeitete Cases</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalCases}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Durchschnittsscore</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading
                    ? '...'
                    : stats.averageScore > 0
                      ? `${stats.averageScore}/10`
                      : 'Noch keine'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assessments</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats.completedAssessments}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Start New Case */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-4">Neuen Case starten</h2>
            <p className="text-gray-600 mb-6">
              Wähle einen neuen Consulting-Case und verbessere deine Fähigkeiten.
            </p>
            <a
              href="/cases"
              className="bg-[#00bfae] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#009688] transition-colors inline-block"
            >
              Case starten
            </a>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-4">Letzte Aktivität</h2>
            {stats.totalCases > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Case abgeschlossen</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Assessment erhalten</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">
                  Noch keine Aktivität. Starte deinen ersten Case!
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 text-[#00bfae] hover:text-[#009688] transition-colors text-sm font-medium"
                >
                  📚 Onboarding wiederholen
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
