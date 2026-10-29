/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mystic: {
          950: '#07050f',
          900: '#0d091e',
          850: '#130d2d',
          800: '#1c133f',
          700: '#2c1e63',
          600: '#4c35a8',
          500: '#7352f2',
          gold: '#dfb76c',
          goldLight: '#fae6a2',
          goldDark: '#9b7630',
          accent: '#c084fc',
          cyan: '#38bdf8'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'mystic-glow': '0 0 25px rgba(223, 183, 108, 0.25)',
        'mystic-purple': '0 0 30px rgba(115, 82, 242, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
