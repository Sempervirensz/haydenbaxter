/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['"Montserrat"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        mono: ['"DM Mono"', '"Courier New"', "monospace"],
      },
      letterSpacing: {
        widest: "0.22em",
      },
    },
  },
  plugins: [],
};
