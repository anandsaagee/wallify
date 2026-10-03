/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        card: '#1a1a1a',
        border: '#2a2a2a',
        primary: '#FACB15',
        muted: '#A1A1AA',
      },
      fontFamily: {
        display: ['DM Serif Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'grid': '8px',
      },
      aspectRatio: {
        'poster': '3 / 4',
      },
      borderRadius: {
        'premium': '12px',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(0.75)' },
        },
        // BottomSheet animations
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(110%)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        shimmer:   'shimmer 2s infinite',
        pulseDot:  'pulseDot 1.4s ease-in-out infinite',
        slideUp:   'slideUp 320ms cubic-bezier(0.16,1,0.3,1) forwards',
        slideDown: 'slideDown 300ms cubic-bezier(0.4,0,1,1) forwards',
        fadeIn:    'fadeIn 200ms ease-out forwards',
        fadeOut:   'fadeOut 300ms ease-in forwards',
      },
    },
  },
  plugins: [],
  corePlugins: {
    scrollSnapStop: true,
  },
};
