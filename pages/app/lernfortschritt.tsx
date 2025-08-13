import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/AuthContext';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/card';

export default function LernfortschrittPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f4f0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#009e82] mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router wird umleiten
  }

  return (
    <>
      <Header variant="app" />
      <div className="navaa-page navaa-bg-primary min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">📈 Dein Lernfortschritt</h1>
                <p className="text-gray-600">
                  Verfolge deine Entwicklung und erkenne deine Stärken
                </p>
              </div>
            </div>
          </div>

          {/* Dummy Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Hauptbereich */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fortschritts-Übersicht */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎯 Lernfortschritt Übersicht
                  </CardTitle>
                  <CardDescription>
                    Deine Entwicklung in den verschiedenen Bereichen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* 1. Strukturierung (25% Gewichtung) - navaa Dimension */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Strukturierung</span>
                        <span className="text-sm text-gray-600">82/100 Punkte</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#009e82] h-3 rounded-full transition-all duration-300"
                          style={{ width: '82%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        MECE-Prinzip, logische Gliederung, systematische Herangehensweise
                      </p>
                    </div>

                    {/* 2. Hypothesenbildung (20% Gewichtung) - navaa Dimension */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Hypothesenbildung</span>
                        <span className="text-sm text-gray-600">75/100 Punkte</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#007a66] h-3 rounded-full transition-all duration-300"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Entwicklung relevanter und testbarer Hypothesen, Priorisierung
                      </p>
                    </div>

                    {/* 3. Quantitative Analyse (25% Gewichtung) - navaa Dimension */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Quantitative Analyse</span>
                        <span className="text-sm text-gray-600">88/100 Punkte</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#00bfae] h-3 rounded-full transition-all duration-300"
                          style={{ width: '88%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Korrekte Interpretation von Daten, angemessene Berechnungen
                      </p>
                    </div>

                    {/* 4. Empfehlungsqualität (20% Gewichtung) - navaa Dimension */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Empfehlungsqualität</span>
                        <span className="text-sm text-gray-600">85/100 Punkte</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#009688] h-3 rounded-full transition-all duration-300"
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Klarheit, Begründung, Umsetzbarkeit der Empfehlung
                      </p>
                    </div>

                    {/* 5. Kommunikation (10% Gewichtung) - navaa Dimension */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Kommunikation</span>
                        <span className="text-sm text-gray-600">79/100 Punkte</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-[#00897b] h-3 rounded-full transition-all duration-300"
                          style={{ width: '79%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Verständlichkeit, Executive Summary, stakeholder-gerechte Aufbereitung
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Letzte Aktivitäten - B1 Enhanced */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>📋 Letzte Aktivitäten</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Aktuelle Aktivität mit Feedback-Indikator */}
                    <div className="flex items-center gap-3 p-3 bg-[#009e82] bg-opacity-5 rounded-lg border-l-4 border-[#009e82]">
                      <div className="w-2 h-2 bg-[#009e82] rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Foundation Case 2 - Strategische Analyse
                        </div>
                        <div className="text-sm text-gray-600">vor 2 Stunden gestartet</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-[#009e82] text-white px-2 py-1 rounded-full">
                              In Bearbeitung
                            </span>
                            <span className="text-xs text-gray-500">⏱️ 23 Min</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#009e82] font-medium">Aktiv</div>
                      </div>
                    </div>

                    {/* Abgeschlossene Aktivität mit Bewertung */}
                    <div className="flex items-center gap-3 p-3 bg-navaa-bg-secondary rounded-lg">
                      <div className="w-2 h-2 bg-[#007a66] rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Foundation Case 1 - Marktanalyse
                        </div>
                        <div className="text-sm text-gray-600">vor 1 Tag abgeschlossen</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              ✓ Abgeschlossen
                            </span>
                            <span className="text-xs text-gray-500">⭐ 85/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-600 font-medium">Gut</div>
                      </div>
                    </div>

                    {/* Onboarding Aktivität */}
                    <div className="flex items-center gap-3 p-3 bg-navaa-bg-secondary rounded-lg">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Onboarding Assessment</div>
                        <div className="text-sm text-gray-600">vor 3 Tagen abgeschlossen</div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              🎯 Baseline
                            </span>
                            <span className="text-xs text-gray-500">⭐ 78/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-blue-600 font-medium">Basis</div>
                      </div>
                    </div>

                    {/* User Feedback Indikator */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-900">
                          💬 Feedback-Status
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        <div className="flex justify-between items-center">
                          <span>Letzte Bewertung erhalten:</span>
                          <span className="font-medium">vor 1 Tag</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span>Nächstes Feedback:</span>
                          <span className="font-medium text-[#009e82]">Nach Case 2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistiken */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">📊 Deine Statistiken</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#009e82]">45</div>
                      <div className="text-sm text-gray-600">Minuten gelernt</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#007a66]">85%</div>
                      <div className="text-sm text-gray-600">Erfolgsrate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#009e82]">3</div>
                      <div className="text-sm text-gray-600">Tage Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nächste Ziele */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg">🎯 Nächste Ziele</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#009e82] rounded-full"></div>
                      <span className="text-sm">Foundation Case 2 abschließen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-500">3 Cases in Folge schaffen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-500">Advanced Training freischalten</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Placeholder Info */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">🚧 In Entwicklung</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-yellow-700">
                    Diese Seite wird noch weiterentwickelt. Bald findest du hier detaillierte
                    Analysen deines Lernfortschritts und personalisierte Empfehlungen.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
