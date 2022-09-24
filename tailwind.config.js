/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {},
    colors: {
      white: '#FFFFFF',
      black: '#000000',
      light: '#B9BBBE',
      'dark-1': '#424549',
      'dark-2': '#36393E',
      'dark-3': '#282B30',
      'dark-4': '#2F3136',
      'dark-5': '#1E2124',
      'bg-dark': 'hsla(217,7.6%,33.5%,0.6)',
      primary: '#5865F2',
      'bg-primary': 'hsl(235, 86%, 65%, 0.4)',
      'primary-hover': '#4752C4',
      secondary: '#4F545C',
      'secondary-hover': '#686D73',
      green: '#2D7D46',
      red: '#D83C3E',
      'red-hover': '#A12D2F',
      'shadow-col': 'rgba(4,4,5,0.2)',
    },
  },
  plugins: [],
}
