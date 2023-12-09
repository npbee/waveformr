import colors from "tailwindcss/colors";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      gray: colors.slate,
      primary: colors.orange,
      white: colors.white,
      accent: {
        orange: "#E97927",
        red: "#AF3736",
        purple: "#4F315B",
      },
    },
    extend: {
      scale: {
        flip: "-1",
      },
      fontFamily: {
        display: ["Audiowide"],
      },
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
