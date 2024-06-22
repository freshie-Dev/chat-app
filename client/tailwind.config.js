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
        },
        moveLeftRight: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(7px)' },
        }
      },
      animation: {
        blinkingBg: 'blinkingBg 2s ease-in-out infinite',
        moveLeftRight: 'moveLeftRight 1s ease-in-out infinite',
      },
      colors: {
        // Add your custom colors here
        c1: '#3B3B3B ',
        c2: '#cf3f0a',
        c3: '#DC5F00',
        c4: '#EEEEEE',
        c5: '#3B3B3B ',
        // Add as many custom colors as needed
      },
    },
  },
  plugins: [],
}