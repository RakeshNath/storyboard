/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "rgb(229 231 235)",
        input: "rgb(229 231 235)",
        ring: "rgb(17 24 39)",
        background: "rgb(255 255 255)",
        foreground: "rgb(17 24 39)",
        primary: {
          DEFAULT: "rgb(17 24 39)",
          foreground: "rgb(255 255 255)",
        },
        secondary: {
          DEFAULT: "rgb(243 244 246)",
          foreground: "rgb(17 24 39)",
        },
        destructive: {
          DEFAULT: "rgb(239 68 68)",
          foreground: "rgb(255 255 255)",
        },
        muted: {
          DEFAULT: "rgb(243 244 246)",
          foreground: "rgb(107 114 128)",
        },
        accent: {
          DEFAULT: "rgb(243 244 246)",
          foreground: "rgb(17 24 39)",
        },
        popover: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(17 24 39)",
        },
        card: {
          DEFAULT: "rgb(255 255 255)",
          foreground: "rgb(17 24 39)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
