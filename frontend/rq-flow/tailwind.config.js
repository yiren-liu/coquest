/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,ts,tsx,jsx}"],
  darkMode: "class",
  important: true,
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      borderColor: {
        "red-outline": "rgba(255, 0, 0, 0.8)",
        "green-outline": "rgba(72, 187, 120, 0.7)",
      },
      boxShadow: {
        "red-outline": "0 0 10px rgba(255, 0, 0, 0.5)",
        "green-outline": "0 0 5px rgba(72, 187, 120, 0.7)",
      },

      animation: {
        "pulse-green": "pulseGreen 1s linear",
        "pulse-red": "pulseRed 1s linear infinite",
        "pulse-gray-to-orange": "pulseGrayToOrange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-orange": "pulseOrange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-strong": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pulseGreen: {
          "0%": { boxShadow: "0 0 0 0 rgba(72, 187, 120, 0.7)" },
          "100%": { boxShadow: "0 0 0 10px rgba(72, 187, 120, 0)" },
        },
        pulseRed: {
          "0%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.5)" },
          "100%": { boxShadow: "0 0 0 10px rgba(255, 0, 0, 0)" },
        },
        pulseOrange: {
          "0%": { boxShadow: "0 0 0 0 rgba(0, 0, 0, 0.2)" },
          "100%": { boxShadow: "0 0 0 10px rgba(255, 165, 0, 1)" },
        },
        pulseGrayToOrange: {
          "0%": { boxShadow: "0 0 0 0 rgba(255, 0, 0, 0.5)" },
          // "50%": { boxShadow: "0 0 0 10px rgba(255, 0, 0, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(255, 165, 0, 0.5)" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class", // only generate classes
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".arrow-hide": {
          "&::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          "&::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
        },
        '.password':{
          "-webkit-text-security":"disc",
          "font-family": "text-security-disc"

        },
        '.custom-scroll':{
          '&::-webkit-scrollbar': {
            'width': '8px',
          },
          '&::-webkit-scrollbar-track': {
            'backgroundColor': '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            'backgroundColor': '#ccc',
            'borderRadius': '999px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'backgroundColor': '#bbb'
        }
      }
    })
    }),require('@tailwindcss/line-clamp')
  ],
};