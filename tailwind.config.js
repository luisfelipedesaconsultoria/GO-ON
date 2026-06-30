/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0B5A28",
        forestLight: "#13803A",
        ink: "#0D0F0E",
        charcoal: "#1C1F1D",
        lime: "#C8F562",
        coral: "#FF6B4A",
        cream: "#FAFAF7",
        stone: "#6B716C",
        amber: "#E8A23D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Archivo", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
