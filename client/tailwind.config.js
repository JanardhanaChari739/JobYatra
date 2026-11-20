/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050D18',
          900: '#081220',
          DEFAULT: '#0B192C',
          850: '#0E2038',
          800: '#112540',
          700: '#183358',
          600: '#234473',
          500: '#325C96'
        },
        gold: {
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#F5BE47',
          DEFAULT: '#E5A852',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          accent: '#E5A852'
        },
        surface: {
          offwhite: '#F8FAFC',
          cream: '#FAF7F2',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(11, 25, 44, 0.06), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        elevated: '0 10px 30px -3px rgba(11, 25, 44, 0.1), 0 4px 10px -2px rgba(11, 25, 44, 0.05)',
        gold: '0 4px 14px 0 rgba(229, 168, 82, 0.39)'
      }
    },
  },
  plugins: [],
}
