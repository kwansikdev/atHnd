import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // 'font-sans' 클래스를 대체하거나 새로운 이름을 부여합니다.
        sans: ["A2z", "ui-sans-serif", "system-ui"],
        brand: ["A2z", "serif"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
