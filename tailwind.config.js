/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        brand: {
          blue:  '#1a7be2',
          teal:  '#1ed8ca',
          navy:  '#0b1a35',
          navy2: '#0d1f3e',
        },
      },
    },
  },
  plugins: [],
};
