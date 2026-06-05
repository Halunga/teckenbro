import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16211f",
        moss: "#445f53",
        clay: "#b95f49",
        mist: "#eef3ef",
        paper: "#fbfaf6"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(22, 33, 31, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
