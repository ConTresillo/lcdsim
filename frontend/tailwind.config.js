/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00F0FF',
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        mono: ['VT323', 'monospace'],
        tech: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px #00F0FF, 0 0 20px #00F0FF',
      },

      // ✅ CURSOR BLINKING FIX: ADD KEYFRAMES AND ANIMATION
        keyframes: {
        // FIX: Toggles background-color (B to A) instead of opacity
        pulse: {
          '0%, 100%': {
            // State B (ON/Bright Cyan)
            'background-color': '#4DD0E1', // Approximate bg-cyan-300
            'box-shadow': '0 0 4px #22d3ee', // Keep the glow when ON
          },
          '50%': {
            // State A (OFF/Dark Gray/Blue)
            'background-color': '#0f1f22', // The dark background color
            'box-shadow': 'none',          // Remove glow when OFF
          },
        }
      },
      animation: {
        pulse: 'pulse 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}