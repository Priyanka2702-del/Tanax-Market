import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#0866C5", dark: "#064E99", light: "#E8F3FD" },
        sky: { DEFAULT: "#65D4F5", light: "#EAF9FE" },
        ink: { DEFAULT: "#0B2A4A", soft: "#4A6280" },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans Variable'", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0866C5 0%, #2A9BE0 55%, #65D4F5 100%)",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(8,102,197,0.25)",
        lift: "0 24px 50px -18px rgba(8,102,197,0.35)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      animation: { float: "float 6s ease-in-out infinite", "float-slow": "float 8s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
