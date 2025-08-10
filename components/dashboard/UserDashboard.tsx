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
 * ✅ Dashboard Logic - User-specific content and progress tracking
 * ✅ Course Integration - Display enrolled courses and progress
 * ✅ Loading States - Robust loading and error handling
 * ✅ User Experience - Clear navigation and status indicators
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

interface UserStats {
  completedCases: number;
  totalCases: number;
  totalTimeSpent: number; // in minutes
  successRate: number; // percentage
  currentStreak: number;
}

interface LearningStatus {
  registered: boolean;
  onboardingCompleted: boolean;
  foundationCasesPassed: boolean;
  advancedTrainingUnlocked: boolean;
}

export default function UserDashboard() {
  const { user } = useAuth();

  // Placeholder data - später aus DB laden
  const userStats: UserStats = {
    completedCases: 2,
    totalCases: 12,
    totalTimeSpent: 45,
    successRate: 85,
    currentStreak: 3,
  };

  const learningStatus: LearningStatus = {
    registered: true,
    onboardingCompleted: true,
    foundationCasesPassed: false,
    advancedTrainingUnlocked: false,
  };

  const getFirstName = (email: string) => {
    // Fallback: Ersten Teil der E-Mail als Name verwenden
    return email?.split('@')[0]?.split('.')[0] || 'User';
  };

  const getStatusIndicator = (status: boolean, label: string) => (
    <div className="flex items-center space-x-3">
      <div className={`w-3 h-3 rounded-full ${status ? 'bg-[#009e82]' : 'bg-gray-300'}`} />
      <span className={`text-sm font-medium ${status ? 'text-[#2d3748]' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );

  const progressPercentage = (userStats.completedCases / userStats.totalCases) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Header - Flächig */}
        <div className="mb-16">
          <h1 className="text-4xl font-light text-[#2d3748] mb-3">
            Willkommen, {getFirstName(user?.email || '')}! 👋
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Bereit für dein nächstes Case Training?
          </p>
        </div>

        {/* Status Section - Flächige Gestaltung */}
        <div className="bg-gradient-to-r from-[#f8f9fa] to-[#f1f3f4] rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-medium text-[#2d3748] mb-6">Dein Lernstatus</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {getStatusIndicator(learningStatus.registered, 'Registriert')}
            {getStatusIndicator(learningStatus.onboardingCompleted, 'Onboarding')}
            {getStatusIndicator(learningStatus.foundationCasesPassed, 'Foundation Cases')}
            {getStatusIndicator(learningStatus.advancedTrainingUnlocked, 'Advanced Training')}
          </div>
        </div>

        {/* Main Action Section - Flächig */}
        <div className="bg-gradient-to-r from-[#e8f5f3] to-[#f0f9f7] rounded-3xl p-10 mb-12">
          <h2 className="text-2xl font-medium text-[#2d3748] mb-8">🚀 Hier weitermachen</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aktueller Case */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-medium text-[#007a66] mb-2">Foundation Case 2</h3>
              <p className="text-[#2d3748] mb-4">Market Entry Strategy</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  ⏱️ Geschätzte Zeit: 15 Minuten
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  📖 Schritt 3 von 5: Analyse & Zahlenarbeit
                </div>
              </div>
              <Button className="w-full bg-[#009e82] hover:bg-[#007a66] text-white rounded-xl py-3">
                ▶️ Fortsetzen
              </Button>
            </div>

            {/* Neuer Case */}
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-medium text-[#2d3748] mb-2">Foundation Case 3</h3>
              <p className="text-gray-600 mb-4">Cost Optimization</p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  🏆 Schwierigkeit: Mittel
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  🎯 Framework: Cost-Benefit Analysis
                </div>
              </div>
              <Button className="w-full bg-gray-200 hover:bg-[#009e82] hover:text-white text-gray-700 rounded-xl py-3 transition-all">
                ➡️ Starten
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Section - Flächig */}
        <div className="bg-white/50 rounded-3xl p-10 mb-12">
          <h2 className="text-2xl font-medium text-[#2d3748] mb-8">📊 Deine Entwicklung</h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-[#2d3748] font-medium">Foundation Cases Fortschritt</span>
              <span className="text-gray-600">
                {userStats.completedCases}/{userStats.totalCases} Cases
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#009e82] to-[#007a66] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-[#009e82] mb-2">
                {userStats.totalTimeSpent}
              </div>
              <div className="text-sm text-gray-600">Minuten gelernt</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#007a66] mb-2">
                {userStats.successRate}%
              </div>
              <div className="text-sm text-gray-600">Erfolgsrate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#009e82] mb-2">
                {userStats.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Tage Streak</div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Goals - Flächig */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-medium text-[#2d3748] mb-6">🚀 Schnellzugriff</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-white/60"
              >
                <span className="text-base">📚 Onboarding wiederholen</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-white/60"
              >
                <span className="text-base">🎯 Framework-Übersicht</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left p-4 h-auto hover:bg-white/60"
              >
                <span className="text-base">🏆 Meine Erfolge</span>
              </Button>
            </div>
          </div>

          {/* Learning Goals */}
          <div className="bg-gradient-to-br from-[#f8f9fa] to-[#f1f3f4] rounded-2xl p-8">
            <h3 className="text-xl font-medium text-[#2d3748] mb-6">🎯 Deine Lernziele</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#009e82] rounded-full"></div>
                <span className="text-[#2d3748]">Foundation Cases abschließen</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Advanced Training freischalten</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-gray-500">Zertifizierung erhalten</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tip - Flächig */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 mt-8">
          <h3 className="text-xl font-medium text-amber-800 mb-4">💡 Tipp des Tages</h3>
          <p className="text-amber-700 leading-relaxed">
            Nutze das MECE-Prinzip (Mutually Exclusive, Collectively Exhaustive) für eine
            strukturierte Problemanalyse!
          </p>
        </div>
      </div>
    </div>
  );
}
