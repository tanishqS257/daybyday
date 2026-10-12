
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0D12",
        panel: "#12151D",
        muted: "#858B9B",
        accent: "#A3E635",
      },
    },
  },
  plugins: [],
};

