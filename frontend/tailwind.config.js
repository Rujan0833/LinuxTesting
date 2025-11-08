/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-red': {
          DEFAULT: '#8B0000',
          light: '#DC143C',
        },
      },
    },
  },
  plugins: [],
}
