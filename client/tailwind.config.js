/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1c1752',
        },
        secondary: {
          yellow: '#FFA42C',
          white: '#FFFFFF',
          black: '#000000',
          light: '#F9FAFB',
        },
      },
      backgroundImage: {
        'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      },
      gradientColorStops: {
        'start': '#FFA42C',  // Secondary yellow
        'middle': '#FFFFFF',  // Secondary white
        'end': '#1c1752',     // Primary color
      },
    },
    animation: {
      'fade-in': 'fadeIn 1s ease-out',
      'fade-down': 'fadeDown 1s ease-out',
      'fade-up': 'fadeUp 1s ease-out',
      'zoom-in': 'zoomIn 1s ease-out',
      'slide-in-left': 'slideInLeft 1s ease-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
      fadeDown: {
        '0%': { opacity: 0, transform: 'translateY(-20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      fadeUp: {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
      zoomIn: {
        '0%': { opacity: 0, transform: 'scale(0.95)' },
        '100%': { opacity: 1, transform: 'scale(1)' },
      },
      slideInLeft: {
        '0%': { opacity: 0, transform: 'translateX(-20px)' },
        '100%': { opacity: 1, transform: 'translateX(0)' },
      },
      
    },
    
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Ensure this line exists
  },
};
