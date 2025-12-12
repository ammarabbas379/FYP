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
          purple: "#9D4EDD", // Darker purple for contrast
          'purple-light': "#E0AAFF",
          pink: "#FF99C8",
          blue: "#A2D2FF",
          gold: "#FFC8DD", // Using a soft pink-gold
          gold2: "#FDE2E4",
          lavender: "#E6E0F5", // Slightly darker lavender for better contrast
        }
      },
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        quicksand: ["var(--font-quicksand)", "sans-serif"],
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
