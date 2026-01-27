/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ===== BRAND =====
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover: 'var(--color-brand-hover)',
          light: 'var(--color-brand-light)',
          50: 'var(--color-brand-50)'
        },

        // ===== TEXT =====
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverted: 'var(--color-text-inverted)'
        },

        // ===== BACKGROUNDS =====
        bg: {
          page: 'var(--color-bg-page)',
          card: 'var(--color-bg-card)',
          subtle: 'var(--color-bg-subtle)',
          muted: 'var(--color-bg-muted)'
        },

        // ===== BORDERS =====
        border: {
          DEFAULT: 'var(--color-border-default)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)'
        },

        // ===== SEMANTIC =====
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          border: 'var(--color-success-border)',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        },

        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          border: 'var(--color-warning-border)',
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          700: '#b45309'
        },

        danger: {
          DEFAULT: 'var(--color-danger)',
          light: 'var(--color-danger-light)',
          border: 'var(--color-danger-border)',
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },

        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          border: 'var(--color-info-border)'
        },

        // ===== PRIMARY (Legacy) =====
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },

        // ===== GREEN (Legacy alias) =====
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        }
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },

      boxShadow: {
        glass: 'var(--glass-shadow)'
      }
    }
  },
  plugins: []
}
