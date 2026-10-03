/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          900: '#0a0a12',
          800: '#100f17',
          700: '#171521',
          600: '#201d2e',
          500: '#a77dff',
        },
      },
      boxShadow: {
        glow: '0 14px 28px rgba(140,98,255,0.45)',
      },
    },
  },
  plugins: [],
}
