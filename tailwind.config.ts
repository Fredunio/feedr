import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f06292",
        primaryLight: "#ff94c2",
        primaryDark: "#ba2d65",
        secondary: "#g06292",
      },
      borderWidth: {
        1: "1px",
        3: "3px",
      },
    },
  },
  plugins: [],
};
export default config;
