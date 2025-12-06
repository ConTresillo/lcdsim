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
      }
    },
  },
  plugins: [],
}