import React, { useState, useEffect } from 'react';

// StickyCTA.tsx
// Sticky CTA button that appears after user scrolls past hero section
export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show sticky CTA after scrolling 50% of viewport height
      if (window.pageYOffset > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 opacity-0 translate-y-5 animate-[fadeIn_0.3s_ease-out_forwards]">
      <a
        href="/chat"
        className="flex items-center px-6 py-3 bg-[#00bfae] text-white font-semibold rounded-full shadow-lg hover:bg-[#009688] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <span className="mr-2">🚀</span>
        <span className="hidden sm:inline">Beta bewerben</span>
        <span className="sm:hidden">Beta</span>
      </a>
    </div>
  );
}
