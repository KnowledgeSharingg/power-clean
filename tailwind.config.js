// tailwind.config.js
/* eslint-disable @typescript-eslint/no-require-imports */
const lineClamp = require("@tailwindcss/line-clamp");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        link: "#1B7B6F",
        primary: "#1B7B6F",
        "primary-light": "#E8F5F3",
        background: "#ffffff",
        border: "#e5e5e5",
        "text-secondary": "#6b7280",
        "tag-bg": "#f0fdf9",
        "tag-text": "#1B7B6F",
        "tag-border": "#d1ede8",
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
      },
      maxWidth: {
        prose: "72ch",
      },
    },
  },
  plugins: [lineClamp],
};
