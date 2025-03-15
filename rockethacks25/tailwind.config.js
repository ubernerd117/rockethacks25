/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}", // Make sure this line exists
    ],
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")], // Ensure DaisyUI is included
  };
  