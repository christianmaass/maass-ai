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
 * ✅ Course Pages - Detailed course information and enrollment
 * ✅ User Experience - Clear course overview and action buttons
 * ✅ Responsive Design - Mobile-first approach
 * ✅ Branding - Consistent navaa visual identity
 *
 * @see CONTRIBUTING.md
 * @see docs/navaa-development-guidelines.md
 */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import { UnifiedGuard, UNIFIED_GUARDS } from '@ui/UnifiedGuard';

interface CourseData {
  id: string;
  name: string;
  description: string;
  difficulty_level: number;
  estimated_duration_hours: number;
  foundation_cases_count: number;
  user_enrolled: boolean;
  user_progress?: {
    progress_percentage: number;
    completed_cases: number;
    total_cases: number;
  };
}

// Strategy Track Course Page
// Displays detailed information about the Strategy Track course
export default function StrategyCoursePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    // Mock course data for Strategy Track
    const mockCourseData: CourseData = {
      id: 'strategy-track',
      name: 'Strategy Track',
      description:
        'Trainiere strategisches Denken an realen Business-Szenarien. Lerne, komplexe Entscheidungen klar zu treffen, Prioritäten zu setzen und strategische Initiativen wirksam umzusetzen – selbst unter Zeitdruck und mit unvollständigen Informationen.',
      difficulty_level: 6,
      estimated_duration_hours: 12,
      foundation_cases_count: 12,
      user_enrolled: false, // Will be updated from API
      user_progress: {
        progress_percentage: 0,
        completed_cases: 0,
        total_cases: 12,
      },
    };

    setCourseData(mockCourseData);
    setLoading(false);
  }, []);

  const handleEnrollment = async () => {
    if (!courseData || !user) return;

    setEnrolling(true);
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: courseData.id,
        }),
      });

      if (response.ok) {
        // Redirect to course onboarding after successful enrollment
        router.push('/tracks/strategy/onboarding');
      } else {
        console.error('Enrollment failed');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinueCourse = () => {
    // Redirect to course onboarding or progress page
    router.push('/tracks/strategy/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navaa-primary mx-auto mb-4"></div>
          <p className="text-navaa-text-secondary">Lade Kurs...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-navaa-bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-navaa-text-secondary">Kurs nicht gefunden</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedGuard config={UNIFIED_GUARDS.COURSE}>
      <div className="min-h-screen bg-navaa-bg-primary">
        <Header variant="app" />

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-navaa-text-primary mb-4">
                  {courseData.name}
                </h1>
                <p className="text-lg text-navaa-text-secondary leading-relaxed">
                  {courseData.description}
                </p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-navaa-bg-primary rounded-lg">
                <div className="text-2xl font-bold text-navaa-primary mb-1">
                  {courseData.foundation_cases_count}
                </div>
                <div className="text-sm text-navaa-text-secondary">Foundation Cases</div>
              </div>
              <div className="text-center p-4 bg-navaa-bg-primary rounded-lg">
                <div className="text-2xl font-bold text-navaa-primary mb-1">
                  {courseData.estimated_duration_hours}h
                </div>
                <div className="text-sm text-navaa-text-secondary">Geschätzte Dauer</div>
              </div>
              {/* Difficulty removed intentionally */}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {courseData.user_enrolled ? (
                <button
                  onClick={handleContinueCourse}
                  className="flex-1 bg-navaa-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-navaa-primary/90 transition-colors"
                >
                  Kurs fortsetzen
                </button>
              ) : (
                <button
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  className="flex-1 bg-navaa-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-navaa-primary/90 transition-colors disabled:opacity-50"
                >
                  {enrolling ? 'Einschreibung läuft...' : 'Jetzt einschreiben'}
                </button>
              )}
              <button
                onClick={() => router.back()}
                className="flex-1 bg-transparent text-navaa-primary px-8 py-4 rounded-xl font-bold border-2 border-navaa-primary hover:bg-navaa-primary hover:text-white transition-colors"
              >
                Zurück
              </button>
            </div>
          </div>

          {/* Course Content Preview */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navaa-text-primary mb-6">Was dich erwartet</h2>

            <div className="space-y-6">
              {/* Box 1: Start Onboarding */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-navaa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navaa-primary font-bold">🚀</span>
                </div>
                <div>
                  <h3 className="text-left text-lg font-bold text-gray-900 mb-2">
                    Start Onboarding
                  </h3>
                  <p className="text-gray-700 text-base mb-2">
                    Starte ohne Umwege: Lerne die navaa-Methodik kennen, um strategische
                    Herausforderungen strukturiert zu lösen. In wenigen Minuten bist du bereit für
                    deine ersten echten Business Cases – und machst den ersten Schritt vom
                    Bauchgefühl zur klaren Entscheidung.
                  </p>
                  <ul className="text-left space-y-1">
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Fallstudien-Logik verstehen
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Strategische Denkweise verinnerlichen
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Erste Praxisübungen absolvieren
                    </li>
                  </ul>
                </div>
              </div>

              {/* Box 2: Foundation Cases */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-navaa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navaa-primary font-bold">🎯</span>
                </div>
                <div>
                  <h3 className="text-left text-lg font-bold text-gray-900 mb-2">
                    Foundation Cases
                  </h3>
                  <p className="text-gray-700 text-base mb-2">
                    Baue dein strategisches Fundament auf: Bearbeite 10–12 strukturierte Cases mit
                    wachsender Komplexität. Erkenne Muster, schärfe deine Analyse und trainiere
                    Entscheidungen unter Druck – mit präzisem Feedback zu deinen Stärken und
                    Entwicklungsfeldern.
                  </p>
                  <ul className="text-left space-y-1">
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      10–12 Business Cases mit klarer Struktur
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Progressiver Anstieg der Schwierigkeit
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Detailliertes, umsetzbares Feedback
                    </li>
                  </ul>
                </div>
              </div>

              {/* Box 3: Expert Cases */}
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-navaa-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-navaa-primary font-bold">🏆</span>
                </div>
                <div>
                  <h3 className="text-left text-lg font-bold text-gray-900 mb-2">Expert Cases</h3>
                  <p className="text-gray-700 text-base mb-2">
                    Spiele in der obersten Liga: Meistere personalisierte Herausforderungen, die
                    exakt zu deinen Zielen passen. Minimalstrukturierte, realistische
                    Gesprächssituationen fordern dich heraus, deine strategische Denk- und
                    Handlungskraft unter Beweis zu stellen.
                  </p>
                  <ul className="text-left space-y-1">
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      GPT-generierte, maßgeschneiderte Cases
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Individuell auf dein Profil zugeschnitten
                    </li>
                    <li className="text-gray-600 flex items-start">
                      <span className="text-[#009e82] mr-2">•</span>
                      Simulation echter High-Stakes-Situationen
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </UnifiedGuard>
  );
}
