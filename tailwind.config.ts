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
        bg: {
          0: "var(--color-bg-page)",
          1: "var(--color-bg-1)",
          2: "var(--color-bg-2)",
          card: "var(--color-bg-card)",
        },
        tx: {
          0: "var(--color-text-primary)",
          1: "var(--color-text-secondary)",
          2: "var(--color-text-body)",
          3: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dim: "var(--color-accent-dim)",
          bg: "var(--color-accent-bg)",
          bdr: "var(--color-accent-bdr)",
        },
        sihua: {
          lu:   "var(--color-sihua-lu)",
          quan: "var(--color-sihua-quan)",
          ke:   "var(--color-sihua-ke)",
          ji:   "var(--color-sihua-ji)",
        },
      },
      fontFamily: {
        sans:  ["var(--primitive-font-sans)"],
        serif: ["var(--primitive-font-serif)"],
        mono:  ["var(--primitive-font-mono)"],
      },
      fontSize: {
        xs:   ["var(--text-xs)",   { lineHeight: "1.5" }],
        sm:   ["var(--text-sm)",   { lineHeight: "1.6" }],
        base: ["var(--text-base)", { lineHeight: "1.75" }],
        lg:   ["var(--text-lg)",   { lineHeight: "1.6" }],
        xl:   ["var(--text-xl)",   { lineHeight: "1.5" }],
        "2xl":["var(--text-2xl)", { lineHeight: "1.3" }],
        "3xl":["var(--text-3xl)", { lineHeight: "1.2" }],
        "4xl":["var(--text-4xl)", { lineHeight: "1.15" }],
        "5xl":["var(--text-5xl)", { lineHeight: "1.1" }],
      },
      spacing: {
        "space-1":  "4px",
        "space-2":  "8px",
        "space-3":  "12px",
        "space-4":  "16px",
        "space-5":  "20px",
        "space-6":  "24px",
        "space-8":  "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
        "space-20": "80px",
        "space-24": "96px",
      },
      borderRadius: {
        sm:  "var(--radius-sm)",
        md:  "var(--radius-md)",
        lg:  "var(--radius-lg)",
        xl:  "var(--radius-xl)",
        "2xl":"var(--radius-2xl)",
        pill:"var(--radius-pill)",
      },
      boxShadow: {
        xs:   "var(--shadow-xs)",
        sm:   "var(--shadow-sm)",
        md:   "var(--shadow-md)",
        lg:   "var(--shadow-lg)",
        xl:   "var(--shadow-xl)",
        gold: "var(--shadow-gold)",
      },
      transitionDuration: {
        fast:   "120ms",
        base:   "200ms",
        slow:   "350ms",
        spring: "400ms",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "fade-down":  "fadeDown 0.3s ease forwards",
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
        fadeDown: {
          "0%":   { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      maxWidth: {
        page: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
