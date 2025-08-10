import React, { useState } from 'react';
import { Heading, Text } from '../ui/Typography';

// FAQSection.tsx
// Displays frequently asked questions to address common concerns and objections
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Was ist navaa und wem hilft es?',
      answer:
        'navaa ist AI Accelerated Enablement: Wir befähigen Unternehmer und Führungskräfte, strategische Herausforderungen eigenständig zu lösen – und sparen dort Beratung, wo sie nicht gebraucht wird.',
    },
    {
      question: 'Wie funktionieren Lernpfade und Tracks?',
      answer:
        'Du wählst einen Track, der zu deinen Zielen passt (z. B. Strategy, Product Manager, CFO, Communication, Hard Decisions, KI Manager, Negotiation). Du trainierst mit realistischen Cases und erhältst präzises Feedback zu deinem Vorgehen. Inhalte und Schwierigkeit passen sich an deinen Fortschritt an.',
    },
    {
      question: 'Worin unterscheidet sich navaa von klassischen Kursen?',
      answer:
        'Statt Theorie lernst du an realen Business-Situationen: strukturieren, entscheiden, kommunizieren. Unsere KI analysiert deine Antworten, macht Stärken sichtbar und gibt konkrete Verbesserungsvorschläge – sofort umsetzbar im Arbeitsalltag.',
    },
    {
      question: 'Wie viel Zeit sollte ich einplanen?',
      answer:
        'Schon 15–20 Minuten pro Tag genügen, um messbar besser zu werden. Viele Nutzer kommen mit 2–3 Stunden pro Woche gut voran und merken nach kurzer Zeit spürbare Verbesserungen in Klarheit und Entscheidungsqualität.',
    },
    {
      question: 'Brauche ich KI-Vorkenntnisse?',
      answer:
        'Nein. Besonders im KI Manager Track lernst du, KI-Projekte zu führen und Mehrwert zu schaffen – ohne selbst Modelle zu bauen. Fokus: strategisch steuern, Wirkung messen, Teams mitnehmen.',
    },
    {
      question: 'Ist navaa für meine Rolle/Branche geeignet?',
      answer:
        'Ja. Die Tracks adressieren typische Führungsaufgaben in verschiedenen Rollen (Strategy, Product, Finance, Kommunikation u. a.). Du bekommst passgenaue Cases und Aufgaben – vom ersten Tag an relevant für deinen Kontext.',
    },
    {
      question: 'Kann ich navaa im Unternehmen einsetzen?',
      answer:
        'Ja. Für Teams bieten wir u. a. gemeinsame Lernziele, Fortschrittseinblicke und auf Wunsch maßgeschneiderte Cases. Sprich uns an – wir zeigen dir Beispiele und Optionen.',
    },
    {
      question: 'Wie geht navaa mit Datenschutz um?',
      answer:
        'Datenschutz hat hohe Priorität. Wir behandeln deine Daten vertraulich und verwenden sie ausschließlich zur Bereitstellung und Verbesserung des Lernangebots. Mehr Details gern auf Anfrage.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <Heading variant="h1" className="mb-4">
          Häufig gestellte Fragen
        </Heading>
        <Text variant="body" as="p" className="text-gray-600">
          Alles, was du über navaa wissen musst
        </Text>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <Heading variant="h2" className="pr-4">
                {faq.question}
              </Heading>
              <div
                className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4">
                <Text variant="body" as="p" className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </Text>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center">
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#f6f4f0' }}>
          <Heading variant="h2" className="mb-3">
            Weitere Fragen?
          </Heading>
          <Text variant="body" as="p" className="text-gray-600 mb-6">
            Unser Team beantwortet gerne alle deine Fragen zu navaa.
          </Text>
          <div className="flex justify-center">
            <a
              href="mailto:info@navaa.ai"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#00bfae] text-white font-semibold rounded-lg hover:bg-[#009688] transition-colors"
            >
              📧 E-Mail schreiben
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
