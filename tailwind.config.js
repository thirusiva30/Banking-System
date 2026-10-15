/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#001F3F',
          light: '#F5F7FA',
          accent: '#0066CC',
        },
      },
    },
  },
  plugins: [],
};
