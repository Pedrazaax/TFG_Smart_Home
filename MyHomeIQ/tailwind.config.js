/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom': 'repeat(auto-fit, minmax(200px, 300px))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}

