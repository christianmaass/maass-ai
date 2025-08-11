import React from 'react';
import Link from 'next/link';
import Header from '@layout/basic/Header';
import Footer from '@layout/basic/Footer';

const LernansatzPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navaa-bg-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🧠 Unser <span className="text-[#009e82]">Lernansatz</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            navaa basiert auf einem modernen, wissenschaftlich fundierten Lernmodell, das echte
            Entwicklung statt bloßer Wissensvermittlung ermöglicht.
          </p>
        </div>

        {/* Wissenschaftliche Grundlage */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Wissenschaftliche Grundlage
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#009e82] mb-4">
                  🎯 Deliberate Practice
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Basierend auf Anders Ericssons Forschung zu gezieltem Üben. Nur durch
                  strukturierte, herausfordernde Aufgaben mit direktem Feedback entwickeln sich
                  echte Fähigkeiten.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#009e82] mb-4">🔄 Iteratives Lernen</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wiederholte Anwendung in verschiedenen Kontexten festigt Denkstrukturen und macht
                  sie in realen Situationen abrufbar.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#009e82] mb-4">
                  📊 Datenbasiertes Feedback
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  KI-gestützte Analyse ermöglicht präzises, objektives Feedback zu Denkprozessen und
                  Entscheidungsqualität.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#009e82] mb-4">🧩 Transferlernen</h3>
                <p className="text-gray-700 leading-relaxed">
                  Strukturierte Problemlösung wird in verschiedenen Business-Kontexten trainiert, um
                  Transfer in den Arbeitsalltag zu gewährleisten.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Der navaa-Lernzyklus */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Der navaa-Lernzyklus
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-[#009e82] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyse</h3>
              <p className="text-gray-600 text-sm">
                Realistische Business Cases mit komplexen Entscheidungssituationen
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#009e82] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Struktur</h3>
              <p className="text-gray-600 text-sm">
                Strukturierte Herangehensweise mit bewährten Frameworks
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#009e82] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback</h3>
              <p className="text-gray-600 text-sm">
                KI-gestützte Bewertung von Denkprozess und Lösungsqualität
              </p>
            </div>
            <div className="text-center">
              <div className="bg-[#009e82] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer</h3>
              <p className="text-gray-600 text-sm">
                Anwendung der Erkenntnisse in neuen, variierenden Kontexten
              </p>
            </div>
          </div>
        </div>

        {/* Personalisierung */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🎯 Vollständig <span className="text-[#009e82]">personalisiert</span>
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8 max-w-3xl mx-auto">
              navaa passt sich an deine individuelle Entwicklung an. Jeder Case, jedes Feedback und
              jede Empfehlung wird speziell für dich generiert.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-[#009e82] bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧩</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Cases</h3>
                <p className="text-gray-600 text-sm">
                  Cases werden basierend auf deinem Fortschritt und deinen Schwächen generiert
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#009e82] bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Individuelles Feedback</h3>
                <p className="text-gray-600 text-sm">
                  KI analysiert deine spezifischen Denkmuster und gibt gezieltes Feedback
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#009e82] bg-opacity-10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Maßgeschneiderte Entwicklung
                </h3>
                <p className="text-gray-600 text-sm">
                  Dein Lernpfad entwickelt sich dynamisch basierend auf deinen Stärken und Zielen
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-navaa-bg-secondary rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                💡 Beispiel: Wie Personalisierung funktioniert
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Schwäche erkannt:</strong> Du neigst dazu, zu schnell zu Lösungen zu
                springen, ohne alle Optionen zu durchdenken.
                <br />
                <strong>navaa reagiert:</strong> Generiert Cases mit bewusst mehrdeutigen
                Situationen und gibt Feedback, das dich zur systematischen Optionsbewertung
                anleitet.
                <br />
                <strong>Ergebnis:</strong> Deine Entscheidungsqualität verbessert sich gezielt in
                diesem Bereich.
              </p>
            </div>
          </div>
        </div>

        {/* Warum funktioniert das? */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-[#009e82] to-[#007a66] rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Warum funktioniert das?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Praxisrelevanz</h3>
                <p className="text-sm opacity-90">
                  Echte Business-Situationen statt theoretischer Beispiele
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Tiefe statt Breite</h3>
                <p className="text-sm opacity-90">
                  Fokus auf Denkqualität und Problemlösungskompetenz
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">Messbare Fortschritte</h3>
                <p className="text-sm opacity-90">
                  Objektive Bewertung und kontinuierliche Verbesserung
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bereit für echte Entwicklung?</h2>
            <p className="text-gray-700 mb-6">
              Erlebe selbst, wie strukturiertes Denken deine Entscheidungsqualität verbessert.
            </p>
            <Link
              href="/"
              className="inline-flex items-center bg-[#009e82] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#007a66] transition-colors"
            >
              Jetzt Case starten
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LernansatzPage;
