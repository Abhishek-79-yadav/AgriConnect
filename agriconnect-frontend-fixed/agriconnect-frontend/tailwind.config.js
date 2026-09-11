/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",       // primary text — deep green-black (light) / off-white (dark)
        paper: "var(--color-paper)",   // background — soft green-white (light) / near-black (dark)
        card: "var(--color-card)",     // raised surfaces
        line: "var(--color-line)",     // hairline borders
        gold: {
          DEFAULT: "#2F6B3E", // primary brand green
          dark: "#1F4D2C",
          light: "#E1EFE3",
        },
        field: {
          DEFAULT: "#6B7F3F", // olive — farmer role accent
          dark: "#4F5F2A",
          light: "#EEF1DF",
        },
        slate: {
          DEFAULT: "#3D5A73", // buyer role accent
          dark: "#2B4256",
          light: "#DCE6ED",
        },
        rust: {
          DEFAULT: "#A8432F", // errors / destructive
          light: "#F3DDD6",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};