/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx,jsx}"],

  theme: {
    extend: {},
  },
  fontFamily: {
    Poppins: ["Poppins", "sans-serif"],
    PoppinsBold: [],
  },
  plugins: [require("daisyui")],
};
