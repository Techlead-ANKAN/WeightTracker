/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',  // Blue-600
          light: '#60a5fa',    // Blue-400
          dark: '#1d4ed8'      // Blue-700
        },
        surface: {
          DEFAULT: '#ffffff',   // White
          muted: '#f8fafc',     // Slate-50
          border: '#e2e8f0'     // Slate-200
        }
      },
      boxShadow: {
        card: '0 20px 25px -15px rgba(15, 23, 42, 0.15)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: [],
}
