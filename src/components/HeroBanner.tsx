import React from 'react';
import { Link } from 'react-router-dom';
import heroPlaceholder from './assets/hero-placeholder.png';

// HeroBanner.tsx
// Main landing page hero section. Highlights the core value proposition and includes a prominent CTA button.
export default function HeroBanner() {
  return (
    <section className="w-full bg-[#f5f8fa] mb-6 py-10 min-h-[600px]">
      <div className="max-w-7xl mx-auto rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center md:items-stretch text-left gap-12 min-h-[600px] bg-[#f5f8fa]">
        <div className="flex-1 flex flex-col items-start justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 font-sans leading-relaxed">
          Strategisches Denken, gute Kommunikation und klares Urteilsvermögen werden erwartet – aber fast nie trainiert
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 font-sans">
            navaa hilft dir dabei - mit echten Cases, direktem Feedback und strukturierter Reflexion. 
          </p>
          <Link to="/chat" className="inline-flex items-center py-4 px-6 w-auto bg-gray-800 text-white rounded-xl font-bold text-xl hover:bg-gray-900 transition-colors whitespace-nowrap">
            Für die Testphase bewerben
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-64 max-w-md bg-gray-300 rounded-xl shadow-md flex items-center justify-center text-gray-500 text-xl select-none">
  Bild
</div>
        </div>
      </div>
    </section>
  );
}
