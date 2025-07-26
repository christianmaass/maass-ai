import React from 'react';

// CredentialsSection.tsx
// Displays certifications and credentials to build trust and authority
export default function CredentialsSection() {
  return (
    <section className="w-full py-6">
      <div className="max-w-6xl mx-auto px-6">
        {/* Expertise Indicators */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm">
            <div className="flex items-center">
              <span className="text-xl mr-2">🧠</span>
              <span>KI-Research seit 2019</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">📈</span>
              <span>500+ Case Studies entwickelt</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">👥</span>
              <span>Team aus Ex-MBB Consultants</span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">🔬</span>
              <span>Peer-reviewed Research</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
