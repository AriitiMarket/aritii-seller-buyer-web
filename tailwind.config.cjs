/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Aritii commerce design system — buyer content pages.
        // (Header/Sidebar keep their own hardcoded branding and never use these.)
        market: {
          bg: '#F7F8FA',       // page background
          card: '#FFFFFF',     // cards / content surfaces
          ink: '#171A21',      // primary text
          muted: '#667085',    // secondary text
          line: '#E5E7EB',     // borders
          brand: '#20305C',    // brand actions & buttons
          'brand-hover': '#2C3F6E',
          'brand-press': '#182647',
          'brand-soft': '#E9ECF5', // soft brand backgrounds
        },
        brand: {
          primary: '#75d04b',
          'primary-light': '#f3ffee',
          'primary-dark': '#5ac12f',
          'primary-hover': '#68c73e',
          'primary-pressed': '#56b02f',
          'primary-disabled': '#b9e8a3',
          'secondary-border': '#111827',
          dark: '#141414'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      },
      width: {
        'custom-button': '110px',
        'app-bar-search': '408px'
      },
      height: {
        'custom-button': '45px'
      },
      fontSize: {
        'heading-1': '20px',
        'heading-2': '36px',
        'card-h1': '16px'
      },
      scale: {
        '102': '1.02'
      },
      container: {
        center: true,
        padding: '2rem',
        screens: { '2xl': '1400px' }
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}