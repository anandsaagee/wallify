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
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [],
  // Add base layer for smooth scrolling
  corePlugins: {
    // ensure scroll-behavior utility is enabled
    scrollSnapStop: true,
  },
};

/*** Add custom base layer ***/
/* In a separate CSS file (e.g., src/index.css) you would add:
@layer base {
  html { scroll-behavior: smooth; }
}
*/
