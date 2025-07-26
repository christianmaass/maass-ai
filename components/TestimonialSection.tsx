import React from 'react';

// TestimonialSection.tsx
// Displays customer testimonials and success stories to build trust and social proof
export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Dr. Sarah Weber",
      role: "Senior Partner, Strategy Consulting",
      company: "Top-Tier Beratung",
      quote: "navaa hat meine Denkstruktur revolutioniert. Die KI-gestützten Cases sind so realitätsnah, dass ich direkt bessere Entscheidungen in echten Projekten treffe.",
      avatar: "👩‍💼"
    },
    {
      name: "Marcus Klein",
      role: "VP Strategy & Business Development",
      company: "DAX-Konzern",
      quote: "Endlich ein Tool, das strategisches Denken wirklich trainiert. Nach 4 Wochen navaa kommuniziere ich deutlich strukturierter mit dem Vorstand.",
      avatar: "👨‍💼"
    },
    {
      name: "Lisa Hoffmann",
      role: "Head of Product Management",
      company: "Scale-up",
      quote: "Die personalisierten Cases haben mir geholfen, komplexe Produktentscheidungen systematischer anzugehen. Mein Team merkt den Unterschied.",
      avatar: "👩‍💻"
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Was unsere Nutzer sagen
        </h2>
        <p className="text-lg text-gray-600">
          Führungskräfte aus verschiedenen Branchen vertrauen bereits auf navaa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{testimonial.avatar}</div>
              <div>
                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-xs text-[#00bfae] font-semibold">{testimonial.company}</p>
              </div>
            </div>
            <blockquote className="text-gray-700 italic leading-relaxed">
              "{testimonial.quote}"
            </blockquote>
            <div className="flex text-[#00bfae] mt-4">
              {'★'.repeat(5)}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 text-center">
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🔒</span>
            <span>DSGVO-konform</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🇩🇪</span>
            <span>Made in Germany</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            <span>Wissenschaftlich fundiert</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            <span>Sofort einsatzbereit</span>
          </div>
        </div>
        
        {/* Sekundäre CTA nach Testimonials */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Bereit für ähnliche Erfolge?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Schließe dich erfolgreichen Führungskräften an, die bereits mit navaa ihre Entscheidungsqualität verbessert haben.
          </p>
          <a 
            href="/chat" 
            className="inline-flex items-center px-8 py-3 bg-[#00bfae] text-white font-semibold rounded-lg hover:bg-[#009688] transition-colors"
          >
            🎯 Jetzt starten
          </a>
        </div>
      </div>
    </section>
  );
}
