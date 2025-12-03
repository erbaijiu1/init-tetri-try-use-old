/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx", 
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['VT323', 'monospace'],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}