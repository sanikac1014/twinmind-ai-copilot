/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(1.25rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "context-nudge": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.02)", opacity: "0.92" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.35" },
          "30%": { transform: "translateY(-3px)", opacity: "1" },
        },
        "card-glow": {
          "0%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0.45)" },
          "100%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.45s ease-out forwards",
        "context-nudge": "context-nudge 0.65s ease-in-out",
        "typing-dot": "typing-dot 1s ease-in-out infinite",
        "card-glow": "card-glow 0.85s ease-out forwards",
      },
    },
  },
  plugins: [],
};
