/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: "#0F1310",       // deep ink-green, not pure black
          surface: "#161C18",
          surfaceRaised: "#1D2420",
          line: "#2B342F",
          ink: "#EDEFE9",      // warm paper-white text
          inkMuted: "#9AA69C",
          seal: "#C98A3E",     // wax-seal amber — the one accent, used sparingly
          sealMuted: "#8A6236",
          verify: "#5FA98A",   // verified/success green, distinct from seal
          alert: "#C4694F",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        seal: "3px",
      },
    },
  },
  plugins: [],
};
