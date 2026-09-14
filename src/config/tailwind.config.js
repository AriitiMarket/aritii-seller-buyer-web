/**
 * Aritii Market - Custom Tailwind Configuration
 * Ethiopian-inspired brand colors and typography
 * 
 * This configuration extends the default Tailwind theme with:
 * - Ethiopian brand color palette (greens, golds, earth tones)
 * - Custom font families (Plus Jakarta Sans, Playfair Display)
 * - Custom CSS classes for pattern decorations
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  
  theme: {
    extend: {
      // Ethiopian Brand Color Palette
      colors: {
        brand: {
          // Deep green tones
          green: '#083B24',           // Deep Ethiopian Forest Green
          'green-dark': '#052919',    // Darker forest variant
          'green-light': '#0F5435',   // Lighter forest variant
          
          // Gold tones
          gold: '#E5A93C',            // Warm Imperial Gold
          'gold-hover': '#D49525',    // Gold hover state
          
          // Earth tones
          sand: '#F7F5F0',            // Light sand
          cream: '#FDFAF4',           // Warm cream
          charcoal: '#1A1E1C',        // Deep charcoal
          terracotta: '#C8522C',      // Warm terracotta
        },
      },

      // Custom Font Families
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },

      // Custom Spacing & Sizing
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      // Custom Border Radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },

      // Shadow Customizations
      boxShadow: {
        'brand-sm': '0 2px 8px rgba(8, 59, 36, 0.12)',
        'brand-md': '0 4px 16px rgba(8, 59, 36, 0.15)',
        'brand-lg': '0 12px 24px rgba(8, 59, 36, 0.18)',
        'gold-glow': '0 0 20px rgba(229, 169, 60, 0.25)',
      },

      // Animation Extensions
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      animation: {
        shimmer: 'shimmer 2s infinite',
        'slide-in-down': 'slideInDown 0.3s ease-out',
      },
    },
  },

  plugins: [
    // Custom Plugin for Pattern Classes
    function({ addComponents, theme }) {
      addComponents({
        // Tibeb Pattern Border - Ethiopian geometric pattern
        '.tibeb-pattern-border': {
          '@apply relative': {},
          '@apply border-2 border-brand-gold': {},
          '@apply rounded-lg': {},
          
          '&::before': {
            content: '""',
            '@apply absolute': {},
            '@apply inset-0': {},
            '@apply rounded-lg': {},
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(229, 169, 60, 0.1) 10px,
                rgba(229, 169, 60, 0.1) 20px
              )
            `,
            pointerEvents: 'none',
          },
        },

        // Pattern Background Overlay - Subtle geometric pattern
        '.pattern-bg-overlay': {
          '@apply relative': {},
          
          '&::before': {
            content: '""',
            '@apply absolute': {},
            '@apply inset-0': {},
            background: `
              linear-gradient(
                135deg,
                transparent 24%,
                rgba(8, 59, 36, 0.05) 25%,
                rgba(8, 59, 36, 0.05) 26%,
                transparent 27%,
                transparent 74%,
                rgba(8, 59, 36, 0.05) 75%,
                rgba(8, 59, 36, 0.05) 76%,
                transparent 77%,
                transparent
              )
            `,
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
          },
        },

        // Brand-themed utility classes
        '.text-brand-primary': {
          '@apply text-brand-green': {},
        },

        '.bg-brand-primary': {
          '@apply bg-brand-green': {},
        },

        '.btn-brand-primary': {
          '@apply px-4 py-2 bg-brand-green text-white rounded-lg font-semibold transition-all duration-200': {},
          '@apply hover:bg-brand-green-dark hover:shadow-brand-md': {},
        },

        '.btn-brand-secondary': {
          '@apply px-4 py-2 bg-brand-gold text-brand-charcoal rounded-lg font-semibold transition-all duration-200': {},
          '@apply hover:bg-brand-gold-hover hover:shadow-gold-glow': {},
        },

        '.card-brand': {
          '@apply bg-white rounded-xl border border-gray-100 shadow-brand-sm transition-all duration-300': {},
          '@apply hover:shadow-brand-lg hover:border-brand-gold': {},
        },

        '.input-brand': {
          '@apply w-full px-4 py-2 border border-gray-200 rounded-lg text-brand-charcoal transition-colors duration-200': {},
          '@apply focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20': {},
          '@apply placeholder:text-gray-400': {},
        },

        '.badge-brand': {
          '@apply inline-block px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-sm font-medium': {},
        },
      });
    },
  ],
};
