import React, { useState } from 'react';
import { Heading, Text } from '@ui/Typography';
import Image from 'next/image';
import { useAuth } from '@contexts/AuthContext';
import { CATALOG } from '@lib/assetPaths';

// TargetAudienceSection.tsx
// Displays target audience information and course selection with slider functionality
export default function TargetAudienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user, loading } = useAuth();

  // Debug logging
  console.log('TargetAudienceSection - Auth State:', {
    user: !!user,
    loading,
    userEmail: user?.email,
  });

  const courses = [
    {
      id: 1,
      title: 'Schluss mit Blindflug – so setzt du Strategie um:',
      image: CATALOG.strategy,
      description: 'Chaos ordnen: Komplexe Herausforderungen klar strukturieren',
      description2: 'Schneller entscheiden: Mit präzisem Rahmen handeln',
      targetGroup: 'Märkte formen: Chancen sehen und aktiv gestalten',
    },
    {
      id: 2,
      title: 'Produkte steuern – vom Konzept bis zum Markt:',
      image: CATALOG.po,
      description: 'Kunden verstehen: Bedürfnisse früh erkennen',
      description2: 'Priorisieren: Ressourcen dorthin lenken, wo es zählt',
      targetGroup: 'Erfolg messen: Datenbasiert verbessern statt blind entwickeln',
    },
    {
      id: 3,
      title: 'Finanzen führen – ohne sich im Detail zu verlieren:',
      image: CATALOG.cfo,
      description: 'Kennzahlen meistern: Die richtigen Zahlen kennen und nutzen',
      description2: 'Wachstum steuern: Investitionen strategisch ausrichten',
      targetGroup: 'Risikobewusst handeln: Chancen nutzen, Risiken begrenzen',
    },
    {
      id: 4,
      title: 'So kommunizieren, dass alle zuhören – und folgen',
      image: CATALOG.communication,
      description: 'Klar auftreten: Wirkung erzeugen statt Worte verlieren',
      description2: 'Führen mit Sprache: Gespräche leiten wie Entscheidungen',
      targetGroup: 'Überzeugen: Ideen verkaufen, ohne sie aufzudrängen',
    },
    {
      id: 5,
      title: 'Schwierige Entscheidungen – ohne endlose Meetings:',
      image: CATALOG.hardDecisions,
      description: 'Klarheit gewinnen: Wenn es richtig wehtut, den Weg finden',
      description2: 'Verantwortung übernehmen: Nicht delegieren, sondern handeln',
      targetGroup: 'Fokus halten: Entscheidungen umsetzen statt zerreden',
    },
    {
      id: 6,
      title: 'KI führen – nicht von Buzzwords blenden lassen:',
      image: CATALOG.kiManager,
      description: 'Strategisch steuern: KI-Projekte mit messbarem Mehrwert',
      description2: 'Game Changer werden: KI nicht nur einführen, sondern nutzen',
      targetGroup: 'Vertrauen schaffen: Teams mit in den Wandel nehmen',
    },
    {
      id: 7,
      title: 'Verhandeln, bis beide Seiten gewinnen – und du mehr:',
      image: CATALOG.negotiation,
      description: 'Strategisch vorgehen: Vorbereitung, die den Ton setzt',
      description2: 'Taktisch reagieren: Auf jede Wendung vorbereitet sein',
      targetGroup: 'Abschluss sichern: Deals erzielen, die langfristig tragen',
    },
  ];

  // Renders a bullet with optional styling for the prefix before the first colon
  const renderBullet = (text: string, highlightPrefix: boolean) => {
    if (!highlightPrefix) return text;
    const idx = text.indexOf(':');
    if (idx === -1) return text;
    const prefix = text.slice(0, idx);
    const rest = text.slice(idx + 1); // omit the colon
    return (
      <span>
        <span className="text-[#009e82] font-semibold">{prefix}</span>
        {':'}
        {rest}
      </span>
    );
  };

  const coursesPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const maxIndex = Math.max(0, courses.length - coursesPerView.desktop);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const _targetGroups = [
    {
      icon: '💼',
      title: 'Berater & Strategieteams',
      status: 'Live',
      statusColor: 'bg-green-100 text-green-800',
      description:
        'navaa trainiert strategisches Denken und kommunikative Fähigkeiten im Stil eines Expert Partners in der Beratung.',
      benefits: [
        'Strukturierte Problemanalyse',
        'Executive Communication',
        'Stakeholder Management',
      ],
    },
    {
      icon: '🛠️',
      title: 'Produktmanager & POs',
      status: 'In Vorbereitung',
      statusColor: 'bg-yellow-100 text-yellow-800',
      description:
        'navaa trainiert deine Produktmanagement Skills und den Dialog mit technischen Teams und klassischen Stakeholdern.',
      benefits: ['Product Strategy', 'Cross-functional Leadership', 'Technical Communication'],
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <Heading variant="display" className="mb-4">
          navaa entwickelt <span className="text-[#009e82]">Führungskräfte</span> gezielt weiter
        </Heading>
        <Text variant="body" as="p" className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Personalsierte Lernpfade und Skill Tracks - <br></br>passgenau für deine strategischen
          Herausforderungen und Karriereziele
        </Text>
      </div>

      {/* Course Slider */}
      <div className="mb-16 relative">
        {/* Pagination Dots - Centered above slider */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(courses.length / coursesPerView.desktop) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentIndex / coursesPerView.desktop) === index
                      ? 'bg-[#009e82]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Zu Kursgruppe ${index + 1}`}
                />
              ),
            )}
          </div>
        </div>

        {/* Slider Container with Side Navigation */}
        <div className="relative">
          {/* Left Arrow - Aligned with card edge */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            style={{ top: '40%' }}
            className={`absolute left-0 -translate-y-1/2 -translate-x-6 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
              currentIndex === 0
                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                : 'text-white bg-[#009e82] hover:bg-[#007a66] hover:shadow-xl hover:scale-105'
            }`}
            aria-label="Vorherige Kurse"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow - Aligned with card edge */}
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            style={{ top: '40%' }}
            className={`absolute right-0 -translate-y-1/2 translate-x-6 z-10 p-3 rounded-full shadow-lg transition-all duration-200 ${
              currentIndex >= maxIndex
                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                : 'text-white bg-[#009e82] hover:bg-[#007a66] hover:shadow-xl hover:scale-105'
            }`}
            aria-label="Nächste Kurse"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Slider Content - Clean overflow hidden */}
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-all duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / coursesPerView.desktop)}%)`,
              }}
            >
              {courses.map((course) => (
                <div key={course.id} className="w-full md:w-1/3 flex-shrink-0 px-2">
                  <div className="text-center">
                    <div className="w-full rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain"
                        priority
                      />
                    </div>
                    <Heading variant="h2" className="text-left mb-3">
                      {course.title}
                    </Heading>
                    <ul className="text-left space-y-1 mb-4">
                      <li className="text-gray-600 flex items-start">
                        <span className="text-[#009e82] mr-2">•</span>
                        {renderBullet(course.description, true)}
                      </li>
                      {course.description2 && (
                        <li className="text-gray-600 flex items-start">
                          <span className="text-[#009e82] mr-2">•</span>
                          {renderBullet(course.description2, true)}
                        </li>
                      )}
                      <li className="text-gray-600 flex items-start">
                        <span className="text-[#009e82] mr-2">•</span>
                        {renderBullet(course.targetGroup, true)}
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
