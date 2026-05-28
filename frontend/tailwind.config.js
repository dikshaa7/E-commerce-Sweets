/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d9bd',
          300: '#e8bf94',
          400: '#dc9d66',
          500: '#d4824a',
          600: '#c66a3a',
          700: '#a55331',
          800: '#85442d',
          900: '#6d3927',
        },
        accent: {
          500: '#8b4513',
          600: '#723a10',
        },
        dark: {
          800: '#1a1a2e',
          900: '#16213e',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
