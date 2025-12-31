import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        story: {
          purple: "#9D4EDD",         // Main brand color: buttons, text highlights, navigation, and feature icons
          'purple-light': "#E0AAFF", // Soft background accents and decorative elements
          pink: "#FF99C8",           // Secondary brand color: hover states, icons, and CTA accents
          blue: "#A2D2FF",           // Decorative highlights and alternative icon colors
          gold: "#FFC8DD",           // Premium highlights: sparkles, special buttons, and magical effects
          gold2: "#FDE2E4",          // Soft background gradients and decorative section fills
          lavender: "#E6E0F5",       // Primary background color for pages and layouts
        }
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],

      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-delay': 'float 7s ease-in-out 1s infinite',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        sparkle: 'sparkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
