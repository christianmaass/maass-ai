module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // navaa Brand Colors
        primary: '#009e82', // Türkis
        secondary: '#00bfae', // Helleres Türkis für Hover-Zustände

        // navaa Background System
        'navaa-bg': {
          primary: '#f6f4f0', // Warme, beige Haupthintergrundfarbe
          secondary: '#ffffff', // Weiß für Cards/Komponenten
          accent: '#f8f9fa', // Sehr helles Grau für Akzente
        },

        // navaa Semantic Colors
        navaa: {
          'warm-beige': '#f6f4f0', // Haupthintergrund
          success: '#10b981', // Erfolg/Abgeschlossen
          warning: '#f59e0b', // Warnung/In Bearbeitung
          info: '#3b82f6', // Information/Baseline
          error: '#ef4444', // Fehler
        },

        // navaa Gray Scale (für bessere Konsistenz)
        'navaa-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },

      // navaa Spacing System
      spacing: {
        'navaa-xs': '0.5rem', // 8px
        'navaa-sm': '1rem', // 16px
        'navaa-md': '1.5rem', // 24px
        'navaa-lg': '2rem', // 32px
        'navaa-xl': '3rem', // 48px
      },

      // navaa Typography
      fontFamily: {
        navaa: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
