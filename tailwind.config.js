/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'main-background': '#e43b3b',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981',
        dark: '#1f2937',
        light: '#f9fafb',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
    },
  },
  plugins: [],
}