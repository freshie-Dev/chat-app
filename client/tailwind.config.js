import { color } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blinkingBg: {
          '0%, 100%': { color: '#3B3B3B' },
          '50%': { color: '#EEEEEE' },
        }
      },
      animation: {
        blinkingBg: 'blinkingBg 2s ease-in-out infinite',
      },
      colors: {
        // Add your custom colors here
        c1: '#3B3B3B ',
        c2: '#CF0A0A',
        c3: '#DC5F00',
        c4: '#EEEEEE',
        c5: '#3B3B3B ',
        // Add as many custom colors as needed
      },
    },
  },
  plugins: [],
}