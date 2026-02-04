/** @type {import('tailwindcss').Config} */
module.exports = {
  // ── purge / content ─────────────────────────────────────────────
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}"
  ],

  // ── dark mode via class strategy ────────────────────────────────
  darkMode: "class",

  theme: {
    extend: {
      // ── brand colours ─────────────────────────────────────────
      colors: {
        primary: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        slate: {
          850: "#1a2332",
          900: "#0f172a",
          950: "#0a0f1a",
        },
      },

      // ── typography ────────────────────────────────────────────
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],       // headings
        body:    ["'DM Sans'", "sans-serif"],      // body / UI
        mono:    ["'JetBrains Mono'", "monospace"],
      },

      // ── shadows ───────────────────────────────────────────────
      boxShadow: {
        card:  "0 4px 24px rgba(15, 23, 42, .08)",
        modal: "0 24px 64px rgba(15, 23, 42, .30)",
        glow:  "0 0 32px rgba(99, 102, 241, .35)",
      },

      // ── border-radius ─────────────────────────────────────────
      borderRadius: {
        card: "14px",
        modal: "18px",
      },

      // ── animation ─────────────────────────────────────────────
      keyframes: {
        "slide-down": {
          "0%":   { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "toast-in": {
          "0%":   { opacity: "0", transform: "translateX(110%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-down": "slide-down .3s cubic-bezier(.4,0,.2,1) both",
        "slide-up":   "slide-up .3s cubic-bezier(.4,0,.2,1) both",
        "fade-in":    "fade-in .25s ease both",
        "toast-in":   "toast-in .28s cubic-bezier(.4,0,.2,1) both",
      },
    },
  },
  plugins: [],
};
