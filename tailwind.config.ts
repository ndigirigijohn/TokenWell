import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary purple theme
        primary: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#5B21B6",
          50: "#FAF5FF",
          100: "#F3E8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#9333EA",
          700: "#7C3AED",
          800: "#6D28D9",
          900: "#5B21B6",
        },
        // Secondary dark theme
        secondary: {
          DEFAULT: "#1A1A2E",
          light: "#2E2E48",
          dark: "#0F0F1E",
        },
        // Accent colors
        accent: {
          DEFAULT: "#7C3AED",
          glow: "#C084FC",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #8B5CF6 0%, #5B21B6 100%)",
        "gradient-subtle": "linear-gradient(180deg, #1A1A2E 0%, #0F0F1E 100%)",
        "gradient-glow": "radial-gradient(circle at 50% 50%, #C084FC 0%, transparent 70%)",
      },
      animation: {
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px #8B5CF6, 0 0 10px #8B5CF6, 0 0 15px #8B5CF6" },
          "100%": { boxShadow: "0 0 10px #C084FC, 0 0 20px #C084FC, 0 0 30px #C084FC" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "glow": "0 0 15px rgba(139, 92, 246, 0.5)",
        "glow-lg": "0 0 30px rgba(139, 92, 246, 0.6)",
      },
    },
  },
  plugins: [],
};

export default config;

