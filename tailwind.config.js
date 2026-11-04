/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: {
        brand: { 50: '#EFF6FF', 100: '#DBEAFE', 600: '#1D4ED8', 700: '#1E40AF', 800: '#1E3A8A', 900: '#12285C' },
        accent: { 50: '#F0FDFA', 100: '#CCFBF1', 600: '#0D9488', 700: '#0F766E' },
        paper: '#F8FAFC',
      },
      boxShadow: {
        soft: '0 15px 45px rgba(27,47,94,.07)',
        float: '0 28px 75px rgba(21,42,95,.15)',
      },
      borderRadius: { '2.5xl': '1.4rem' },
    },
  },
  plugins: [],
};
