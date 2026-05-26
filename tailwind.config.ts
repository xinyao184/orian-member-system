import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Extracted directly from the O'rian Dessert logo & product photos
        cocoa: {
          DEFAULT: "#513c3b", // logo background — deep cocoa brown
          deep: "#3a2a29",
          dark: "#2a1d1d",
          900: "#241817",
        },
        rose: {
          DEFAULT: "#c6a2a2", // logo lettering — dusty rose
          light: "#dcc0c0",
          deep: "#b88a8a",
        },
        gold: {
          DEFAULT: "#c9a36b", // rose-gold accent
          light: "#e3c79a",
          deep: "#a8814d",
        },
        cream: {
          DEFAULT: "#f6efe9",
          soft: "#efe5dd",
        },
        strawberry: "#e23b2e", // from the daifuku photo
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(42, 29, 29, 0.18)",
        gold: "0 0 24px rgba(201, 163, 107, 0.45)",
        stamp: "0 12px 40px rgba(226, 59, 46, 0.25)",
        card: "0 20px 60px -15px rgba(36, 24, 23, 0.45)",
      },
      backdropBlur: { xs: "2px" },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
