import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          50: "#e6e9ed",
          100: "#ccd2db",
          200: "#99a5b7",
          300: "#667893",
          400: "#334b6f",
          500: "#001e4b",
          600: "#00183c",
          700: "#00122d",
          800: "#000c1e",
          900: "#00060f",
        },
        primary: {
          DEFAULT: "#001e4b", // Navy
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FF8C00", // Orange
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#6B7280",
        }
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        poppins: ["var(--font-poppins)"],
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
export default config;
