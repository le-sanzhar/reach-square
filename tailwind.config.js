/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0D0D0D',
        primary: '#C9A84C',
        'text-main': '#F2EDE0',
        'text-muted': '#8B7355',
        'card-bg': '#161410',
        'border-gold': 'rgba(201,168,76,0.2)',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
