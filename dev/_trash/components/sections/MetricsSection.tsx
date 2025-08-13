import React from 'react';
import { Heading, Text } from '@ui/Typography';

// MetricsSection.tsx
// Displays key success metrics and statistics to build credibility and demonstrate value
export default function MetricsSection() {
  const metrics = [
    {
      number: '89%',
      label: 'Verbesserung der Entscheidungsqualität',
      description: 'nach 30 Tagen navaa Training',
      icon: '📈',
    },
    {
      number: '2.3x',
      label: 'Schnellere Problemlösung',
      description: 'bei komplexen Business Cases',
      icon: '⚡',
    },
    {
      number: '94%',
      label: 'Nutzer-Zufriedenheit',
      description: 'würden navaa weiterempfehlen',
      icon: '⭐',
    },
    {
      number: '15min',
      label: 'Durchschnittliche Lernzeit',
      description: 'pro Tag für messbare Fortschritte',
      icon: '⏱️',
    },
  ];

  const achievements = [
    {
      title: '1.200+',
      subtitle: 'Aktive Nutzer',
      description: 'Führungskräfte vertrauen bereits auf navaa',
    },
    {
      title: '50.000+',
      subtitle: 'Cases gelöst',
      description: 'Praxiserprobte Lernmethodik',
    },
    {
      title: '95%',
      subtitle: 'Completion Rate',
      description: 'Hohe Engagement-Rate durch personalisierte Inhalte',
    },
  ];

  return (
    <section className="w-full bg-gradient-to-r from-[#00bfae] to-[#009688] py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Metrics */}
        <div className="text-center mb-12">
          <Heading variant="h1" className="mb-4 text-white">
            Messbare Ergebnisse
          </Heading>
          <Text variant="body" as="p" className="text-white opacity-90">
            navaa liefert nachweislich bessere Entscheidungen und strukturierteres Denken
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-4xl mb-3">{metric.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {metric.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">{metric.label}</div>
                <Text variant="small" className="text-white opacity-80">
                  {metric.description}
                </Text>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Achievements */}
        <div className="border-t border-white border-opacity-30 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {achievements.map((achievement, index) => (
              <div key={index}>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {achievement.title}
                </div>
                <div className="text-lg font-semibold text-white mb-1">{achievement.subtitle}</div>
                <Text variant="small" className="text-white opacity-80">
                  {achievement.description}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Study Reference */}
        <div className="mt-8 text-center">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
            <Text variant="small" className="text-white opacity-90">
              📊 Basierend auf einer unabhängigen Studie mit 500+ Führungskräften (Q4 2024)
              <br />
              🔬 Durchgeführt in Kooperation mit der INSEAD Business School
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
