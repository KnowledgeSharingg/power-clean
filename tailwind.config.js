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
        link: "#0a62ff",
      },
      fontFamily: {
        // System UI stack for a clean, readable look
        sans: [
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
        prose: "72ch", // comfortable reading width
      },
    },
  },
  plugins: [lineClamp],
};
