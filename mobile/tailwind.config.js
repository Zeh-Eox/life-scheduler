/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        surface: "#121212",
        card: "#1C1C1C",
        "card-border": "#262626",
        "text-primary": "#F2F2F0",
        "text-secondary": "#7A7A76",
        accent: "#FF5A36",
        "accent-soft": "#FF8562",
        "accent-tint": "#2A1712",
        danger: "#F5766F",
        success: "#8FD97A",
      },
      borderRadius: {
        card: "18px",
        control: "14px",
        sheet: "24px",
      },
    },
  },
  plugins: [],
};
