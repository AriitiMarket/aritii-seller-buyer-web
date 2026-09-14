/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      Roboto: ["Roboto", "sans-serif"],
      Poppins: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        brand: {
          primary: "#0B6E4F",
          "green-dark": "#0B5A3F",
          "green": "#16A34A",
          accent: "#F5A623",
          gold: "#D4AF37",
          secondary: "#C0392B",
          cream: "#FDF6EC",
          charcoal: "#1F2937",
          muted: "#6B7280",
          border: "#E5E7EB",
        },
      },
      screens: {
        "1000px": "1050px",
        "1100px": "1110px",
        "800px": "800px",
        "1300px": "1300px",
        "400px": "400px",
      },
    },
  },
  plugins: [],
}