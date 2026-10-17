/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Aritii Brand Colors
        aritii: {
          green: '#75d04b',           // Primary - buttons, highlights, active states
          'green-dark': '#5ab82e',    // Dark variant for hover
          'green-light': '#8fda6f',   // Light variant for backgrounds
          dark: '#131921',            // Headers, primary text
          'dark-alt': '#0f1111',      // Alternative dark
          border: '#232f3e',          // Light borders
          muted: '#9aa6b2',           // Secondary text
          success: '#28a745',         // Success states
          warning: '#ffc107',         // Warning states
          error: '#dc3545',           // Error states
          'error-light': '#f8d7da',   // Error light background
          'success-light': '#d4edda', // Success light background
          'warning-light': '#fff3cd', // Warning light background
        },
        market: {
          surface: '#ffffff',
          'surface-dim': '#f7f7f7',
          'surface-bright': '#ffffff',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#f0f2f2',
          'surface-container': '#e6e6e6',
          'surface-container-high': '#d5d9d9',
          'surface-container-highest': '#c0c5c5',
          'on-surface': '#131921',    // Use Aritii dark
          'on-surface-variant': '#9aa6b2',  // Use Aritii muted
          header: '#131921',
          'header-border': '#232f3e',
          subnav: '#232f3e',
          'subnav-border': '#37475a',
          primary: '#75d04b',         // Aritii green
          'primary-hover': '#5ab82e', // Aritii green dark
          'primary-pressed': '#4da11f',
          'primary-container': '#8fda6f',  // Aritii green light
          'on-primary': '#ffffff',
          'inverse-primary': '#75d04b',
          secondary: '#2162a1',
          'secondary-hover': '#0064f9',
          'on-secondary': '#ffffff',
          tertiary: '#dc3545',        // Aritii error
          'tertiary-hover': '#c82333',
          'on-tertiary': '#ffffff',
          error: '#dc3545',           // Aritii error
          'on-error': '#ffffff',
          price: '#dc3545',           // Use error for prices
          outline: '#888c8c',
          'outline-variant': '#969696',
          border: '#232f3e',          // Aritii border
          background: '#ffffff',
          'on-background': '#131921',
          'surface-variant': '#f0f2f2',
          'inverse-surface': '#131921',
          'inverse-on-surface': '#ffffff',
        },
        brand: {
          primary: '#75d04b',         // Aritii green
          'primary-light': '#8fda6f', // Aritii green light
          'primary-dark': '#5ab82e',  // Aritii green dark
          'primary-hover': '#5ab82e',
          'primary-pressed': '#4da11f',
          'primary-disabled': '#c9e6bb',
          'secondary-border': '#232f3e',  // Aritii border
          dark: '#131921'             // Aritii dark
        }
      },
      fontFamily: {
        'market-display': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        'market-text': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '64px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-lg': ['40px', { lineHeight: '48px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'headline-md': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'title-lg': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'title-md': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'title-sm': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-md': ['13px', { lineHeight: '18px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'overline': ['11px', { lineHeight: '16px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '5px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        'full': '9999px',
        'button': '5px',
      },
      boxShadow: {
        'level-1': 'none',
        'level-2': '0 3px 8px rgba(15, 17, 17, 0.15)',
        'level-3': '0 8px 24px rgba(15, 17, 17, 0.2)',
        'level-2-sm': '0 1px 3px rgba(15, 17, 17, 0.1)',
        'search': '0 2px 5px rgba(15, 17, 17, 0.15)',
        'card': '0 1px 2px rgba(15, 17, 17, 0.1), 0 1px 3px rgba(15, 17, 17, 0.1)',
        'card-hover': '0 4px 8px rgba(15, 17, 17, 0.15)',
      },
      minHeight: {
        'button': '40px',
        'input': '40px',
      },
      height: {
        'button': '40px',
        'input': '40px',
        'header': '60px',
        'subnav': '40px',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '200ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '16px',
          sm: '24px',
          lg: '32px',
          xl: '40px',
        },
        screens: {
          '2xl': '1400px',
        },
      },
      zIndex: {
        'header': '70',
        'subnav': '60',
        'drawer': '50',
        'dropdown': '40',
        'modal': '80',
        'toast': '90',
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}