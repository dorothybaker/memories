/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: { primary: "#132f3bfe" },
      backgroundColor: { primary: "#132f3bfe" },
      flex: { 2: "2 2 0%" },
    },
  },
  plugins: [],
};
