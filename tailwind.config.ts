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
        // 3-layer token system — semantic aliases
        bg: {
          0: "var(--color-bg-page)",
          1: "var(--color-bg-1)",
          2: "var(--color-bg-2)",
          card: "var(--color-bg-card)",
          inv: "var(--color-bg-inv)",
        },
        tx: {
          0: "var(--color-text-primary)",
          1: "var(--color-text-secondary)",
          2: "var(--color-text-body)",
          3: "var(--color-text-muted)",
          inv: "var(--color-text-inv)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dim: "var(--color-accent-dim)",
          bg: "var(--color-accent-bg)",
          bdr: "var(--color-accent-bdr)",
        },
        // Si Hua — data tokens (chart display only)
        sihua: {
          lu:   "var(--color-sihua-lu)",
          quan: "var(--color-sihua-quan)",
          ke:   "var(--color-sihua-ke)",
          ji:   "var(--color-sihua-ji)",
        },
      },
      fontFamily: {
        sans: ["var(--primitive-font-sans)"],
        mono: ["var(--primitive-font-mono)"],
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      borderRadius: {
        xs:   "var(--radius-xs)",
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      fontSize: {
        xs:   ["var(--text-xs)",   { lineHeight: "1.5" }],
        sm:   ["var(--text-sm)",   { lineHeight: "1.5" }],
        base: ["var(--text-base)", { lineHeight: "1.6" }],
        lg:   ["var(--text-lg)",   { lineHeight: "1.5" }],
        xl:   ["var(--text-xl)",   { lineHeight: "1.4" }],
        "2xl":["var(--text-2xl)",  { lineHeight: "1.3" }],
        "3xl":["var(--text-3xl)",  { lineHeight: "1.2" }],
        "4xl":["var(--text-4xl)",  { lineHeight: "1.15" }],
        "5xl":["var(--text-5xl)",  { lineHeight: "1.1" }],
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "spin-slow":  "spin 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
