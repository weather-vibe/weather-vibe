import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "move-up": "moveUp 40s linear infinite",
      },
      keyframes: {
        moveUp: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 200px" },
        },
      },
    },
    screens: {
      lg: "800px",
    },
    fontFamily: {
      primary: "var(--font-jetbrainsMono)",
    },
  },
  plugins: [],
};
export default config;
