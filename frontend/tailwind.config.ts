import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        backgroundImage: {
          "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
          "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        flicker: {
          "0%": { opacity: "0.1" },
          "5%": { opacity: "0.2" },
          "10%": { opacity: "0.1" },
          "15%": { opacity: "0.3" },
          "20%": { opacity: "0.1" },
          "25%": { opacity: "0.2" },
          "30%": { opacity: "0.1" },
          "35%": { opacity: "0.3" },
          "40%": { opacity: "0.1" },
          "45%": { opacity: "0.2" },
          "50%": { opacity: "0.1" },
          "55%": { opacity: "0.3" },
          "60%": { opacity: "0.1" },
          "65%": { opacity: "0.2" },
          "70%": { opacity: "0.1" },
          "75%": { opacity: "0.3" },
          "80%": { opacity: "0.1" },
          "85%": { opacity: "0.2" },
          "90%": { opacity: "0.1" },
          "95%": { opacity: "0.3" },
          "100%": { opacity: "0.1" },
        },
        turnOn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "5%": {
            transform: "scale(1.02)",
            opacity: "0.3",
          },
          "20%": {
            transform: "scale(0.98)",
            opacity: "0.5",
          },
          "40%": {
            transform: "scale(1.01)",
            opacity: "0.7",
          },
          "60%": {
            transform: "scale(0.99)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(-2%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        flicker: "flicker 5s infinite",
        turnOn: "turnOn 0.8s ease-out forwards",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
export default config

