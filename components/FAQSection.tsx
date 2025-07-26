import React, { useState } from 'react';

// FAQSection.tsx
// Displays frequently asked questions to address common concerns and objections
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Wie unterscheidet sich navaa von anderen Lernplattformen?",
      answer: "navaa ist speziell für Führungskräfte entwickelt und fokussiert sich auf strukturiertes Denken und Entscheidungsfindung. Statt theoretischer Inhalte trainierst du mit realistischen Business Cases und erhältst KI-gestütztes, individuelles Feedback zu deinen Denkprozessen."
    },
    {
      question: "Wie viel Zeit muss ich pro Woche investieren?",
      answer: "Du bestimmst dein Tempo selbst. Bereits 15-20 Minuten täglich reichen aus, um messbare Fortschritte zu erzielen. Die meisten Nutzer investieren 2-3 Stunden pro Woche und sehen bereits nach 2 Wochen erste Verbesserungen in ihrer Entscheidungsqualität."
    },
    {
      question: "Ist navaa für meine Branche/Rolle geeignet?",
      answer: "navaa trainiert universelle Denkfähigkeiten, die in allen Branchen und Führungsrollen relevant sind. Unsere Cases decken verschiedene Bereiche ab: Strategy, Operations, Product Management, Finance und mehr. Das System passt sich automatisch an deine Rolle und Erfahrung an."
    },
    {
      question: "Wie funktioniert das KI-gestützte Feedback?",
      answer: "Unsere KI analysiert deine Antworten auf strukturierte Cases und bewertet Aspekte wie Problemanalyse, Lösungsansatz, Argumentation und Kommunikation. Du erhältst spezifisches Feedback zu deinen Stärken und konkreten Verbesserungsvorschlägen für deine Schwächen."
    },
    {
      question: "Kann ich navaa in meinem Unternehmen einsetzen?",
      answer: "Ja, navaa bietet Enterprise-Lösungen für Teams und Unternehmen. Diese umfassen Team-Dashboards, Fortschrittstracking, Custom Cases für deine Branche und Integration in bestehende Learning Management Systeme. Kontaktiere uns für eine Demo."
    },
    {
      question: "Wie sicher sind meine Daten?",
      answer: "Datenschutz hat höchste Priorität. navaa ist DSGVO-konform, ISO 27001 zertifiziert und hostet alle Daten in Deutschland. Deine Antworten und Fortschritte werden verschlüsselt gespeichert und niemals an Dritte weitergegeben."
    },
    {
      question: "Was passiert nach der Beta-Phase?",
      answer: "Beta-Nutzer erhalten lebenslangen Zugang zu navaa zu vergünstigten Konditionen. Du behältst alle deine Fortschritte und Cases. Als Beta-Nutzer hast du außerdem direkten Einfluss auf die Produktentwicklung und bekommst neue Features zuerst."
    },
    {
      question: "Gibt es eine Geld-zurück-Garantie?",
      answer: "Ja, wir bieten eine 30-Tage-Geld-zurück-Garantie. Wenn du nach 30 Tagen keine Verbesserung in deiner Entscheidungsqualität feststellst, erstatten wir den vollen Betrag zurück - ohne Fragen zu stellen."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Häufig gestellte Fragen
        </h2>
        <p className="text-lg text-gray-600">
          Alles, was du über navaa wissen musst
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-gray-900 pr-4">
                {faq.question}
              </h3>
              <div className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <p className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Weitere Fragen?
          </h3>
          <p className="text-gray-600 mb-6">
            Unser Team beantwortet gerne alle deine Fragen zu navaa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@navaa.ai" 
              className="inline-flex items-center justify-center px-6 py-3 bg-[#00bfae] text-white font-semibold rounded-lg hover:bg-[#009688] transition-colors"
            >
              📧 E-Mail schreiben
            </a>
            <a 
              href="/chat" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#00bfae] font-semibold rounded-lg border-2 border-[#00bfae] hover:bg-[#00bfae] hover:text-white transition-colors"
            >
              💬 Live-Chat starten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
