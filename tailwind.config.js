// tailwind.config.js
/* eslint-disable @typescript-eslint/no-require-imports */
const lineClamp = require("@tailwindcss/line-clamp");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        link: "#137fec",
        primary: "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "card-dark": "#192633",
        "card-dark-alt": "#1a2632",
        "text-muted": "#92adc9",
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Noto Sans",
          "Ubuntu",
          "Cantarell",
          "Helvetica Neue",
          "Arial",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
        display: ["Plus Jakarta Sans", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [lineClamp],
};
