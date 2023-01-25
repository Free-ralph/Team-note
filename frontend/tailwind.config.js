/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ['Quicksand', 'sans-serif'],
      body: ['Quicksand', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary' : '#ffffff',
        'secondary' : '#edf0f8',
        'muted' : '#e8eaec'
      },
      backgroundColor: {
        'primary' : '#ffffff',
        'secondary' : '#edf0f8',
        'alternate' : '#d8dade',
        'muted' : '#e8eaec'

      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        'primary' : '#ffffff',
        'secondary' : '#edf0f8',
        'alternate' : '#d8dade',
        'muted' : '#e8eaec'
      },
    },
  },
}
