/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fefbf8',
          100: '#f6d1b3',
          DEFAULT: '#e26702', // main
          400: '#fb923c',
          500: '#f97316',
          600: '#d95f00',
          800: '#e26600',
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a', // added for completeness if needed, though not in strict list but common
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b', // Used in footer
        },
        red: {
          500: '#ef4444',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'], // Assuming Inter as a modern default choice
      },
      fontSize: {
        'body': ['17px', { lineHeight: '1.5' }],
        'h4': ['20px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'h2': ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        'h1': ['40px', { lineHeight: '1.25', fontWeight: '700' }],
      }
    },
  },
  plugins: [],
}