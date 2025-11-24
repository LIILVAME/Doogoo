/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Active le mode dark via classe sur <html>
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary (Violet) — Actions principales, CTA, focus
        primary: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d5fe',
          500: '#6366f1', // Couleur principale
          600: '#4f46e5', // Hover
          700: '#4338ca'  // Active/Pressed
        },

        // Success (Vert) — Confirmations, états positifs
        success: {
          100: '#d1fae5',
          500: '#10b981',
          700: '#047857'
        },

        // Warning (Orange) — Alertes d'attention
        warning: {
          100: '#fed7aa',
          500: '#f59e0b',
          700: '#b45309'
        },

        // Danger (Rouge) — Erreurs, suppressions
        danger: {
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },

        // Neutral (Gris) — Textes, bordures, backgrounds
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          500: '#71717a',
          700: '#3f3f46',
          900: '#18181b'
        },

        // Alias temporaire pour migration douce (sera retiré en Phase 2)
        // Permet aux composants existants utilisant "green-" de continuer à fonctionner
        green: {
          50: '#d1fae5',   // = success-100
          100: '#d1fae5',
          500: '#10b981',  // = success-500
          600: '#059669',
          700: '#047857'   // = success-700
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}

