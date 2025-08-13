import React from 'react';
import Link from 'next/link';
import { Heading, Text } from '@ui/Typography';

// TestimonialSection.tsx
// Displays customer testimonials and success stories to build trust and social proof
export default function TestimonialSection() {
  const testimonials = [
    {
      name: 'Dr. Sarah Weber',
      role: 'Senior Partner, Strategy Consulting',
      company: 'Top-Tier Beratung',
      quote:
        'navaa hat meine Denkstruktur revolutioniert. Die KI-gestützten Cases sind so realitätsnah, dass ich direkt bessere Entscheidungen in echten Projekten treffe.',
      avatar: '👩‍💼',
    },
    {
      name: 'Marcus Klein',
      role: 'VP Strategy & Business Development',
      company: 'DAX-Konzern',
      quote:
        'Endlich ein Tool, das strategisches Denken wirklich trainiert. Nach 4 Wochen navaa kommuniziere ich deutlich strukturierter mit dem Vorstand.',
      avatar: '👨‍💼',
    },
    {
      name: 'Lisa Hoffmann',
      role: 'Head of Product Management',
      company: 'Scale-up',
      quote:
        'Die personalisierten Cases haben mir geholfen, komplexe Produktentscheidungen systematischer anzugehen. Mein Team merkt den Unterschied.',
      avatar: '👩‍💻',
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <Heading variant="h1" className="mb-4">
          Was unsere Nutzer sagen
        </Heading>
        <Text variant="body" as="p" className="text-gray-600">
          Führungskräfte aus verschiedenen Branchen vertrauen bereits auf navaa
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{testimonial.avatar}</div>
              <div>
                <Heading variant="h2" className="text-gray-900">
                  {testimonial.name}
                </Heading>
                <Text variant="small" className="text-gray-600">
                  {testimonial.role}
                </Text>
                <Text variant="small" className="text-[#009e82] font-semibold">
                  {testimonial.company}
                </Text>
              </div>
            </div>
            <blockquote className="text-gray-700 italic leading-relaxed">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex text-[#009e82] mt-4">{'★'.repeat(5)}</div>
          </div>
        ))}
      </div>

      {/* Sekundäre CTA nach Testimonials */}
      <div className="mt-12 text-center">
        <Heading variant="h2" className="mb-4">
          Bereit für ähnliche Erfolge?
        </Heading>
        <Text variant="body" as="p" className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Schließe dich erfolgreichen Führungskräften an, die bereits mit navaa ihre
          Entscheidungsqualität verbessert haben.
        </Text>
        <Link
          href="/chat"
          className="inline-flex items-center px-8 py-3 bg-[#009e82] text-white font-semibold rounded-lg hover:bg-[#007a66] transition-colors"
        >
          🎯 Jetzt starten
        </Link>
      </div>
    </section>
  );
}
