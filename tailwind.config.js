/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6f0',
          100: '#f9e6d3',
          200: '#f2cda6',
          300: '#e8b379',
          400: '#d17a2b',
          500: '#ac590b',
          600: '#8b4709',
          700: '#6b3607',
          800: '#4d2705',
          900: '#2f1803',
        },
        parchment: '#F5F0EB',
        espresso: '#1A0E09',
        'warm-stone': {
          50: '#F9F6F3',
          100: '#F0EBE4',
          200: '#E3D9CF',
          300: '#CFC0B2',
          400: '#B8A396',
          500: '#9E8A7C',
          600: '#7D6A5E',
          700: '#5E4E45',
          800: '#3D322C',
          900: '#1E1814',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['DM Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        logo: ['Modak', 'cursive'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
