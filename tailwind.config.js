/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shield: {
          dark: '#080c16',
          surface: '#0f172a',
          card: '#151d34',
          border: '#1e293b',
          accent: '#8b5cf6',
          accentHover: '#7c3aed',
          cyan: '#06b6d4',
          rose: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
